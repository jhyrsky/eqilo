"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import packageJson from "../../../package.json";

interface FooterProps {
  businessName?: string;
  businessId?: string;
  addressLine1?: string;
  addressPostalCode?: string;
  addressCity?: string;
  contactPhone?: string;
}

export function Footer({
  businessName = "Eqilo Oy",
  businessId = "3530342-3",
  addressLine1 = "Hakkapeliitantie 4",
  addressPostalCode = "08350",
  addressCity = "LOHJA",
  contactPhone = "+358505633097",
}: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/20">
      <div className="container pt-12 pb-24 md:pt-16 md:pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-xl font-black tracking-tighter text-primary">EQILO.FI</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto sm:mx-0">
              {t("footer.company_desc")}
            </p>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">{t("footer.company")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="font-semibold text-foreground">{businessName}</li>
              <li>{t("footer.business_id")}: {businessId}</li>
              <li>{addressLine1}, {addressPostalCode} {addressCity}</li>
              <li className="pt-2">
                <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center sm:justify-start px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary font-bold hover:bg-primary hover:text-white transition-all w-full sm:w-auto">
                  {contactPhone}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">{t("footer.store")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary font-medium transition-colors">{t("shop.all_equipment")}</Link>
              </li>
              <li>
                <Link href="/sports" className="text-muted-foreground hover:text-primary font-medium transition-colors">{t("nav.sports") || "Sports Categories"}</Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary font-medium transition-colors">{t("nav.services")}</Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary font-medium transition-colors">{t("nav.terms")}</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">{t("footer.partners")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://fdstiming.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary font-medium transition-colors">FDS Timing</a>
              </li>
              <li>
                <a href="https://equipe.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary font-medium transition-colors">Equipe</a>
              </li>
              <li>
                <a href="https://awc2026.fi/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary font-medium transition-colors">AWC 2026</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] xs:text-xs text-muted-foreground text-center md:text-left">
          <p>© {new Date().getFullYear()} {businessName}. {t("footer.rights")} <span className="text-muted-foreground ml-2 font-bold">v{packageJson.version}</span></p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <span className="font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">{t("product.standard_shipping")}</span>
            <Link href="/cookie-policy" className="hover:underline">{t("nav.cookie") || "Cookie Policy"}</Link>
            <Link href="/privacy-policy" className="hover:underline">{t("nav.privacy") || "Privacy Policy"}</Link>
            <Link href="/terms" className="hover:underline">{t("nav.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
