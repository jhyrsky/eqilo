export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface Customer {
  id: string; // Firebase UID
  email?: string; // Optional if signed up via phone
  phone_number?: string; // Optional if signed up via email; required by couriers
  role: 'admin' | 'customer' | 'b2b_customer';
  business_id?: string; // Y-tunnus, required for 'b2b_customer'
  stripe_customer_id?: string;
  shipping_address?: Address;
  billing_address?: Address;
  crm_notes?: string; // Admin-only internal notes for CRM
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface BundleOption {
  id: string;
  component_product_id: string;
  name: string;
  base_quantity: number;
  is_optional: boolean;
  extra_price?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  description_fi?: string;
  description_se?: string;
  specifications?: string;
  specifications_fi?: string;
  specifications_se?: string;
  box_contents?: string; // Content from fdstiming box-contents tab
  downloads?: { name: string; url: string }[]; // Content from fdstiming downloads tab
  videos?: { name: string; url: string }[]; // Content from fdstiming tutorials
  category_id: string; // Reference to `categories` collection
  price: number;
  tax_rate: number; // e.g., 25.5 for Finnish general goods
  sku: string;
  excel_ref_id?: string; // Original ID from Price List Excel
  inventory_count: number;
  is_active: boolean; // Allows drafting or hiding products
  is_featured?: boolean; // Shows product in homepage carousel
  weight?: number; // Essential for shipping calculation
  dimensions?: ProductDimensions;
  image_urls: string[];
  is_bundle?: boolean;
  bundle_options?: BundleOption[];
}

export interface Category {
  id: string;
  name: string; // e.g., 'Equipment', 'Apparel'
  slug: string; // URL-friendly path
  seo_text?: string; // Comprehensive category text explicitly designed for SEO and indexation
  image_url?: string;
}

export interface OrderItem {
  product_id: string;
  product_name?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number; // Pre-tax amount
  tax_total: number; // Total VAT amount, required for Holvi invoicing
  tax_breakdown: {
    rate: number;
    amount: number;
    label: string;
  }[];
  total_amount: number; // Final amount including tax
  shipping_address: Address; // Snapshot at the time of order
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered';
  tracking_number?: string;
  tracking_url?: string;
  courier?: string;
  stripe_payment_intent?: string;
  stripe_customer_id?: string;
  stripe_invoice_pdf?: string;
  stripe_hosted_invoice_url?: string;
  holvi_invoice_id?: string;
  created_at: Date | import('firebase/firestore').Timestamp; // Timestamp
}

export interface CartItem {
  product_id: string;
  quantity: number;
  custom_price_override?: number;
  selected_bundle_options?: string[]; // IDs of selected BundleOptions
  product?: Product; // Local helper for UI mapping
}

export interface Cart {
  id: string;
  user_id?: string; // Optional (if assigned to a specific customer)
  items: CartItem[];
  is_public_link: boolean; // Allows admins to share this cart via a public URL
  abandoned_recovery_sent: boolean; // Tracks if an automated recovery message was sent
  created_at: Date | import('firebase/firestore').Timestamp; // Timestamp
  updated_at: Date | import('firebase/firestore').Timestamp; // Timestamp
}

export interface Settings {
  id: string; // Document ID (e.g., 'global')
  whatsapp_helpdesk_number: string; // Configurable international phone number for the WhatsApp helpdesk link.
}
