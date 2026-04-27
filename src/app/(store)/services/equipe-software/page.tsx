"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Wifi, Cloud, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { SEOContent as EquipeSEO } from "@/components/seo/EquipeSEO";

export default function EquipeSoftwarePage() {
  const { t } = useLanguage();

  return (
    <div className="container py-10 md:py-16 max-w-6xl">
      <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-sm font-bold text-secondary-foreground border border-secondary/20">
            {t("equipe.subtitle")}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            {t("equipe.title")}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("equipe.desc")}
          </p>
          <div className="flex gap-4 pt-4">
             <a href="https://equipe.com" target="_blank" rel="noreferrer">
               <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold h-14 px-8 shadow-lg">
                 {t("equipe.visit")}
               </Button>
             </a>
          </div>
        </div>
        <a href="https://equipe.com" target="_blank" rel="noreferrer" className="flex-1 w-full max-w-md aspect-square bg-gradient-to-br from-secondary/20 to-primary/10 rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl relative overflow-hidden group">
           <Image src="/logos/equipe-logo.png" alt="Equipe" width={240} height={120} className="object-contain group-hover:scale-105 transition-transform duration-500" />
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-24">
         {[
           { title: t("equipe.feature1.title"), desc: t("equipe.feature1.desc"), icon: Wifi },
           { title: t("equipe.feature2.title"), desc: t("equipe.feature2.desc"), icon: Cloud },
           { title: t("equipe.feature3.title"), desc: t("equipe.feature3.desc"), icon: Settings }
         ].map((f, i) => (
           <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-all">
              <CardHeader>
                 <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-secondary-foreground" />
                 </div>
                 <CardTitle className="text-xl font-bold">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </CardContent>
           </Card>
         ))}
      </div>

      <section className="bg-primary rounded-[2rem] p-8 md:p-16 text-primary-foreground relative overflow-hidden">
         <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">{t("equipe.cta_title")}</h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 leading-relaxed">
               {t("equipe.cta_desc")}
            </p>
            <Link href="/shop">
              <Button variant="secondary" size="lg" className="h-14 px-10 font-bold text-lg shadow-xl">
                 {t("equipe.browse")} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
         </div>
         <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </section>
      <div className="mt-20 container px-4 md:px-6">
        <EquipeSEO />
      </div>
    </div>
  );
}
