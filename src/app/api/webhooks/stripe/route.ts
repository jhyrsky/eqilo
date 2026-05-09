import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Stripe } from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { getOrderConfirmationEmailHtml, getAdminNotificationEmailHtml } from "@/lib/emails";
import { fetchStoreSettingsInternal } from "@/lib/actions/admin";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: "2026-03-25.dahlia",
}) : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  if (!stripe) {
    return new NextResponse("Stripe not configured", { status: 500 });
  }
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not defined in the environment.");
  }
  const resend = new Resend(resendApiKey);
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } else {
      throw new Error("Webhook secret is missing");
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const lang = (session.metadata?.lang || "FI") as "FI" | "EN" | "SE";

    if (orderId) {
      const [sessionWithInvoice, settings] = await Promise.all([
        stripe.checkout.sessions.retrieve(session.id, { expand: ['invoice', 'customer'] }),
        fetchStoreSettingsInternal(),
      ]);

      const invoice = sessionWithInvoice.invoice as Stripe.Invoice;
      const stripeCustomerId = sessionWithInvoice.customer as string | Stripe.Customer | Stripe.DeletedCustomer;
      const finalCustomerId = typeof stripeCustomerId === 'string' ? stripeCustomerId : (stripeCustomerId as Stripe.Customer)?.id || null;

      // 1. Update order status
      const orderRef = adminDb.collection("orders").doc(orderId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shippingDetails = (session as any).shipping_details?.address;

      await orderRef.update({
        status: "paid",
        stripe_payment_intent: session.payment_intent as string,
        stripe_customer_id: finalCustomerId,
        stripe_invoice_pdf: invoice?.invoice_pdf || null,
        stripe_hosted_invoice_url: invoice?.hosted_invoice_url || null,
        shipping_address: shippingDetails ? {
          line1: shippingDetails.line1 || "",
          line2: shippingDetails.line2 || "",
          city: shippingDetails.city || "",
          postal_code: shippingDetails.postal_code || "",
          country: shippingDetails.country || "FI",
        } : null,
      });

      try {
        const orderSnap = await orderRef.get();
        const orderData = orderSnap.data();

        if (orderData) {
          const userId = orderData.user_id as string;

          // 2. Decrement inventory for each ordered item
          const inventoryUpdates = (orderData.items as { product_id: string; quantity: number }[]).map(item =>
            adminDb.collection("products").doc(item.product_id).update({
              inventory_count: FieldValue.increment(-item.quantity),
            })
          );

          // 3. Clear the customer's cart
          const cartUpdate = adminDb.collection("carts").doc(userId).update({
            items: [],
            abandoned_recovery_sent: false,
            updated_at: new Date(),
          }).catch(() => {
            // Cart may not exist — that's fine
          });

          await Promise.all([...inventoryUpdates, cartUpdate]);

          // 4. Send order confirmation email
          const userSnap = await adminDb.collection("customers").doc(userId).get();
          const customerEmail = userSnap.data()?.email || session.customer_details?.email;

          if (customerEmail) {
            const subject = lang === "FI" ? `Tilausvahvistus - ${orderId}` :
                            lang === "SE" ? `Orderbekräftelse - ${orderId}` :
                            `Order Confirmation - ${orderId}`;

            await resend.emails.send({
              from: 'Eqilo.fi <orders@eqilo.fi>',
              to: [customerEmail],
              subject,
              html: getOrderConfirmationEmailHtml(orderId, orderData.total_amount, lang, settings),
            });
          }

          // 5. Admin notification
          const adminEmail = settings.notification_email || "orders@eqilo.fi";
          await resend.emails.send({
            from: 'Eqilo.fi System <system@eqilo.fi>',
            to: [adminEmail],
            subject: `NEW ORDER - ${orderId}`,
            html: getAdminNotificationEmailHtml(orderId, orderData.total_amount, userId),
          });
        }
      } catch (err) {
        console.error("Error in post-checkout webhook actions:", err);
      }
    }
  }

  return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}
