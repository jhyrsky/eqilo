import { formatPrice } from "@/lib/utils";

export interface BusinessInfo {
  business_name?: string;
  business_id?: string;
  street_address?: string;
  postal_code?: string;
  city?: string;
}

const DEFAULT_BUSINESS: BusinessInfo = {
  business_name: "Eqilo Oy",
  business_id: "3530342-3",
  street_address: "Hakkapeliitantie 4",
  postal_code: "08350",
  city: "LOHJA",
};

export function getOrderConfirmationEmailHtml(orderId: string, totalAmount: string | number, lang: "FI" | "EN" | "SE" = "FI", biz: BusinessInfo = {}) {
  const b = { ...DEFAULT_BUSINESS, ...biz };
  const content = {
    FI: {
      title: "Tilaus vahvistettu!",
      p1: `Kiitos ostoksestasi Eqilolta. Tilauksesi <strong>#${orderId}</strong> on vastaanotettu ja se on nyt käsittelyssä.`,
      ref: "Tilausviite:",
      total: "Yhteensä:",
      delivery: "FDS Timing -laitteiden vakiotoimitusaika on <strong>1-2 viikkoa</strong>. Saat erillisen ilmoituksen seurantatunnuksella, kun laitteistosi on lähetetty.",
      questions: "Jos sinulla on kysyttävää, vastaa tähän sähköpostiin tai ota yhteyttä WhatsApp-asiakaspalveluumme.",
      regards: "Ystävällisin terveisin,<br/><strong>Eqilo-tiimi</strong>"
    },
    EN: {
      title: "Order Confirmed!",
      p1: `Thank you for your purchase from Eqilo. Your order <strong>#${orderId}</strong> has been successfully placed and is now being processed.`,
      ref: "Order Reference:",
      total: "Total Amount:",
      delivery: "Standard delivery for FDS Timing equipment is <strong>1-2 weeks</strong>. You will receive a separate notification with a tracking number once your equipment has been dispatched.",
      questions: "If you have any questions, feel free to reply to this email or contact us via our WhatsApp Helpdesk.",
      regards: "Best regards,<br/><strong>The Eqilo Team</strong>"
    },
    SE: {
      title: "Order bekräftad!",
      p1: `Tack för ditt köp från Eqilo. Din beställning <strong>#${orderId}</strong> har tagits emot och behandlas nu.`,
      ref: "Orderreferens:",
      total: "Totalbelopp:",
      delivery: "Standardleveranstid för FDS Timing-utrustning är <strong>1-2 veckor</strong>. Du kommer att få ett separat meddelande med ett spårningsnummer när din utrustning har skickats.",
      questions: "Om du har några frågor är du välkommen att svara på detta e-postmeddelande eller kontakta oss via vår WhatsApp-kundtjänst.",
      regards: "Med vänliga hälsningar,<br/><strong>Eqilo-teamet</strong>"
    }
  }[lang];

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-scale; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid #eaeaeb; border-radius: 8px; overflow: hidden; }
          .header { background-color: #0055A4; color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
          .content { padding: 30px; background-color: #ffffff; }
          .content h2 { margin-top: 0; font-size: 20px; color: #1a1a1a; }
          .order-details { background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #f1f5f9; }
          .order-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .order-row:last-child { margin-bottom: 0; padding-top: 10px; border-top: 1px solid #e2e8f0; font-weight: bold; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; background-color: #f8fafc; border-top: 1px solid #eaeaeb; }
          .highlight { color: #0055A4; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EQILO.FI</h1>
          </div>
          <div class="content">
            <h2>${content.title}</h2>
            <p>${content.p1}</p>
            
            <div class="order-details">
              <div class="order-row">
                <span>${content.ref}</span>
                <span class="highlight">${orderId}</span>
              </div>
              <div class="order-row">
                <span>${content.total}</span>
                <span class="highlight">${formatPrice(Number(totalAmount))} €</span>
              </div>
            </div>

            <p>${content.delivery}</p>
            <p>${content.questions}</p>
            
            <p style="margin-top: 30px;">${content.regards}</p>
          </div>
          <div class="footer">
            ${b.business_name} | ${lang === "FI" ? "Y-tunnus" : lang === "SE" ? "Org.nr" : "Business ID"}: ${b.business_id} | ${b.street_address}, ${b.postal_code} ${b.city}
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getAbandonedCartEmailHtml(lang: "FI" | "EN" | "SE" = "FI", baseUrl: string, biz: BusinessInfo = {}) {
  const b = { ...DEFAULT_BUSINESS, ...biz };
  const c = {
    FI: {
      subject: "Unohditko jotain?",
      heading: "Hei!",
      body: "Huomasimme, että jätit ammattilaistason FDS Timing -laitteita ostoskoriisi.",
      cta_body: "Tuotteet odottavat sinua – viimeistele tilaus turvallisesti alla olevasta painikkeesta.",
      button: "Palaa ostoskoriin",
      footer_note: "Et halua enää viestejä? Kirjaudu sisään ja tyhjennä ostoskorisi.",
    },
    EN: {
      subject: "Did you forget something?",
      heading: "Hi there!",
      body: "We noticed you left some professional FDS Timing equipment in your cart.",
      cta_body: "Your items are still waiting — complete your secure checkout with the button below.",
      button: "Return to Cart",
      footer_note: "Don't want reminders? Log in and clear your cart.",
    },
    SE: {
      subject: "Glömde du något?",
      heading: "Hej!",
      body: "Vi märkte att du lämnade professionell FDS Timing-utrustning i din varukorg.",
      cta_body: "Dina produkter väntar på dig — slutför din säkra betalning med knappen nedan.",
      button: "Återgå till varukorgen",
      footer_note: "Vill du inte ha påminnelser? Logga in och töm din varukorg.",
    },
  }[lang];

  return {
    subject: c.subject,
    html: `<!DOCTYPE html>
<html lang="${lang.toLowerCase()}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:#0055A4;padding:28px 40px;">
          <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:-0.5px;">EQILO.FI</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a1a;">${c.heading}</h2>
          <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.6;">${c.body}</p>
          <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">${c.cta_body}</p>
          <a href="${baseUrl}/cart" style="display:inline-block;background:#0055A4;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">${c.button}</a>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e8edf2;">
          <p style="margin:0;font-size:12px;color:#999;line-height:1.6;">
            ${b.business_name} &nbsp;·&nbsp; ${lang === "FI" ? "Y-tunnus" : lang === "SE" ? "Org.nr" : "Business ID"}: ${b.business_id}<br/>
            ${c.footer_note}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

export function getAdminNotificationEmailHtml(orderId: string, totalAmount: string | number, customerId: string) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; color: #333; line-height: 1.5; padding: 20px;">
        <div style="border-left: 4px solid #0055A4; padding-left: 16px;">
          <h2 style="margin-top: 0; color: #0055A4;">🚨 New Eqilo Order Received</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Total Paid:</strong> ${formatPrice(Number(totalAmount))} €</p>
          <p><strong>Customer ID:</strong> ${customerId}</p>
          <br/>
          <p>Please check the <a href="https://eqilo.fi/admin">Eqilo Admin Dashboard</a> to begin processing this order.</p>
        </div>
      </body>
    </html>
  `;
}
