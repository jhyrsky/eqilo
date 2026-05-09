import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReactNode } from "react";
import { fetchStoreSettingsInternal } from "@/lib/actions/admin";

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const settings = await fetchStoreSettingsInternal();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer
        businessName={settings.business_name}
        businessId={settings.business_id}
        addressLine1={settings.address_line1}
        addressPostalCode={settings.address_postal_code}
        addressCity={settings.address_city}
        contactPhone={settings.contact_phone}
      />
    </div>
  );
}
