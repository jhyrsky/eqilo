"use server";

import { CartItem, Product } from "../types/firestore";
import { adminDb } from "../firebase/admin";
import { Resend } from "resend";
import path from "path";
import { formatPrice } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

const fonts = {
  Roboto: {
    normal: path.join(process.cwd(), "src/lib/fonts/Roboto-Regular.ttf"),
    bold: path.join(process.cwd(), "src/lib/fonts/Roboto-Bold.ttf"),
  },
};

export async function generateQuote(
  cartItems: CartItem[],
  orgDetails: {
    name: string;
    contact: string;
    email: string;
    reference?: string;
  }
): Promise<{ success: boolean; pdf?: string; error?: string }> {
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
        const itemTax = itemGross - (itemGross / (1 + (itemTaxRate / 100)));
        grossTotal += itemGross;
        vatTotal += itemTax;
      }
    }

    const subtotal = grossTotal - vatTotal;
    const total = grossTotal;

    // 2. Define PDF Document
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PdfPrinter = require("pdfmake");
    const printer = new (PdfPrinter.default ?? PdfPrinter)(fonts);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docDefinition: any = {
      content: [
        { text: "EQILO.FI - QUOTE", style: "header" },
        { text: `Date: ${new Date().toLocaleDateString()}`, alignment: "right" },
        { text: `Valid for: 30 days`, alignment: "right", margin: [0, 0, 0, 20] },

        {
          columns: [
            {
              width: "*",
              stack: [
                { text: "FROM:", style: "subHeader" },
                "Eqilo Oy",
                "Hakkapeliitantie 4",
                "08350 LOHJA, Finland",
                "Business ID: 3530342-3",
              ],
            },
            {
              width: "*",
              stack: [
                { text: "TO:", style: "subHeader" },
                orgDetails.name,
                orgDetails.contact,
                orgDetails.email,
                orgDetails.reference ? `Ref: ${orgDetails.reference}` : "",
              ],
            },
          ],
        },

        { text: "Equipment Details", style: "sectionHeader", margin: [0, 20, 0, 10] },

        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto"],
            body: [
              [
                { text: "Product", style: "tableHeader" },
                { text: "Qty", style: "tableHeader" },
                { text: "Unit Price", style: "tableHeader" },
                { text: "Total", style: "tableHeader" },
              ],
              ...products.map((p) => [
                p.name,
                p.quantity.toString(),
                `${formatPrice(p.price)} €`,
                `${formatPrice(p.price * p.quantity)} €`,
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },

        {
          margin: [0, 20, 0, 0],
          layout: "noBorders",
          table: {
            widths: ["*", "auto"],
            body: [
              ["Subtotal (0% VAT)", { text: `${formatPrice(subtotal)} €`, alignment: "right" }],
              ["VAT (25.5%)", { text: `${formatPrice(vatTotal)} €`, alignment: "right" }],
              [
                { text: "GRAND TOTAL", bold: true, fontSize: 14 },
                { text: `${formatPrice(total)} €`, bold: true, fontSize: 14, alignment: "right" },
              ],
            ],
          },
        },

        {
          text: "Payment Terms: 14 days net after delivery. Standard shipping (1-2 weeks) included for orders over 200€.",
          margin: [0, 40, 0, 0],
          fontSize: 10,
          color: "gray",
        },
      ],
      styles: {
        header: { fontSize: 22, bold: true, color: "#0055A4", margin: [0, 0, 0, 10] },
        subHeader: { fontSize: 10, bold: true, color: "#666", margin: [0, 0, 0, 5] },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 20, 0, 10] },
        tableHeader: { bold: true, fontSize: 11, color: "black" },
      },
      defaultStyle: { font: "Roboto" },
    };

    // 3. Generate PDF and return as base64
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
    const chunks: Uint8Array[] = [];
    return await new Promise((resolve) => {
      pdfDoc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
      pdfDoc.on("end", async () => {
        const result = Buffer.concat(chunks);
        const base64 = result.toString("base64");

        // Send email copy to user
        try {
          await resend.emails.send({
            from: "Eqilo.fi <quotes@eqilo.fi>",
            to: [orgDetails.email],
            subject: `Equipment Quote - ${orgDetails.name}`,
            text: "Please find your requested equipment quote attached.",
            attachments: [
              {
                filename: `Eqilo_Quote_${orgDetails.name.replace(/[^a-z0-9]/gi, "_")}.pdf`,
                content: base64,
              },
            ],
          });
        } catch (e) {
          console.error("Failed to send quote email", e);
        }

        resolve({ success: true, pdf: base64 });
      });
      pdfDoc.on("error", (err: Error) => {
        console.error("PDF Stream Error:", err);
        resolve({ success: false, error: err.message });
      });
      pdfDoc.end();
    });
  } catch (error) {
    console.error("Quote generation failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
