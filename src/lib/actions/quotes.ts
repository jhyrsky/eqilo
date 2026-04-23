"use server";

import { CartItem, Product } from "../types/firestore";
import { adminDb } from "../firebase/admin";
import { Resend } from "resend";
import { formatPrice } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function generateQuote(
  cartItems: CartItem[],
  orgDetails: {
    name: string;
    contact: string;
    email: string;
    reference?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Fetch full product details
    const products: (Product & { quantity: number })[] = [];
    let grossTotal = 0;
    let vatTotal = 0;

    for (const item of cartItems) {
      const doc = await adminDb.collection("products").doc(item.product_id).get();
      if (doc.exists) {
        const data = doc.data() as Product;
        products.push({ ...data, quantity: item.quantity });
        const itemGross = data.price * item.quantity;
        const itemTaxRate = data.tax_rate || 25.5;
        const itemTax = itemGross - (itemGross / (1 + itemTaxRate / 100));
        grossTotal += itemGross;
        vatTotal += itemTax;
      }
    }

    const subtotal = grossTotal - vatTotal;
    const date = new Date().toLocaleDateString("fi-FI");

    // 2. Build HTML email
    const rows = products.map(p => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${p.name}<br/><span style="font-size:11px;color:#888;">${p.sku}</span></td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${p.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPrice(p.price)} €</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">${formatPrice(p.price * p.quantity)} €</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#0055A4;padding:32px 40px;">
          <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:-0.5px;">EQILO</h1>
          <p style="margin:4px 0 0;color:#a8c8f0;font-size:13px;">Equipment Quote</p>
        </td></tr>

        <!-- Meta -->
        <tr><td style="padding:24px 40px;background:#f8fafc;border-bottom:1px solid #e8edf2;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:50%;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.5px;">FROM</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#333;">
                  <strong>Eqilo Oy</strong><br/>
                  Hakkapeliitantie 4<br/>
                  08350 Lohja, Finland<br/>
                  Y-tunnus: 3530342-3
                </p>
              </td>
              <td style="width:50%;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.5px;">TO</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#333;">
                  <strong>${orgDetails.name}</strong><br/>
                  ${orgDetails.contact}<br/>
                  ${orgDetails.email}
                  ${orgDetails.reference ? `<br/>Ref: ${orgDetails.reference}` : ""}
                </p>
              </td>
            </tr>
            <tr><td colspan="2" style="padding-top:16px;">
              <p style="margin:0;font-size:12px;color:#888;">Date: ${date} &nbsp;·&nbsp; Valid for 30 days</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Products table -->
        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <thead>
              <tr style="background:#f0f4f8;">
                <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.4px;">Product</th>
                <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.4px;">Qty</th>
                <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.4px;">Unit Price</th>
                <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.4px;">Total</th>
              </tr>
            </thead>
            <tbody style="font-size:13px;color:#333;">
              ${rows}
            </tbody>
          </table>

          <!-- Totals -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:2px solid #e8edf2;padding-top:16px;">
            <tr>
              <td style="font-size:13px;color:#666;padding:4px 0;">Subtotal (excl. VAT)</td>
              <td style="font-size:13px;color:#333;text-align:right;padding:4px 0;">${formatPrice(subtotal)} €</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#666;padding:4px 0;">VAT (25.5%)</td>
              <td style="font-size:13px;color:#333;text-align:right;padding:4px 0;">${formatPrice(vatTotal)} €</td>
            </tr>
            <tr>
              <td style="font-size:15px;font-weight:700;color:#0055A4;padding:12px 0 4px;">GRAND TOTAL</td>
              <td style="font-size:15px;font-weight:700;color:#0055A4;text-align:right;padding:12px 0 4px;">${formatPrice(grossTotal)} €</td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e8edf2;">
          <p style="margin:0;font-size:12px;color:#999;line-height:1.6;">
            Payment terms: 14 days net after delivery.<br/>
            Standard shipping (1–2 weeks) included for orders over 200 €.<br/>
            Questions? Reply to this email or contact <a href="mailto:info@eqilo.fi" style="color:#0055A4;">info@eqilo.fi</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // 3. Send email
    await resend.emails.send({
      from: "Eqilo <quotes@eqilo.fi>",
      to: [orgDetails.email],
      bcc: ["tarjoukset@eqilo.fi"],
      subject: `Equipment Quote – ${orgDetails.name}`,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Quote generation failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
