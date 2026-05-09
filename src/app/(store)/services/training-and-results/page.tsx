"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Medal, Presentation, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { SEOContent as TrainingSEO } from "@/components/seo/TrainingSEO";

export default function TrainingAndResultsPage() {
  const { lang, t } = useLanguage();

  if (lang === "FI") {
    return (
      <div className="container py-10 md:py-16 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary border border-primary/20">
               Ammattilaistason Suorituskyky
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Koulutus- ja Tulospalvelu
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
               Eqilo tarjoaa kokonaisvaltaista tukea kilpailujärjestäjille. Varmistamme, että teknologia toimii saumattomasti ja tulokset ovat tarkkoja – jotta te voitte keskittyä urheiluun.
            </p>
          </div>
          <div className="flex-1 w-full max-w-lg aspect-[4/3] rounded-[2rem] border shadow-xl relative overflow-hidden">
             <Image src="/events/horse-park-tour-setup-mirka.jpg" alt="Horse park tour setup" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
           <Card className="border-border/50 shadow-sm p-4">
              <CardHeader>
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Presentation className="w-7 h-7 text-primary" />
                 </div>
                 <CardTitle className="text-2xl font-bold">Koulutuspalvelut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-muted-foreground">Koulutamme seuranne toimihenkilöt käyttämään FDS Timing -laitteistoja ja Equipe-ohjelmistoa tehokkaasti.</p>
                 <ul className="space-y-2">
                    {["Peruskurssit ajanotosta", "Syventävä ohjelmistokoulutus", "Vianetsintä ja huolto"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium">
                         <CheckCircle2 className="w-4 h-4 text-primary" /> {item}
                      </li>
                    ))}
                 </ul>
              </CardContent>
           </Card>

           <Card className="border-border/50 shadow-sm p-4">
              <CardHeader>
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Medal className="w-7 h-7 text-primary" />
                 </div>
                 <CardTitle className="text-2xl font-bold">Tulospalvelu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-muted-foreground">Hoidamme teknisen toteutuksen ja tuloslaskennan puolestanne suurissa kilpailutapahtumissa.</p>
                 <ul className="space-y-2">
                    {["Reaaliaikainen tuloslaskenta", "Live-streaming integraatio", "Virallinen tulosvahvistus"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium">
                         <CheckCircle2 className="w-4 h-4 text-primary" /> {item}
                      </li>
                    ))}
                 </ul>
              </CardContent>
           </Card>
        </div>

        <section className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
           <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden border-4 border-background shadow-xl relative">
                 <Image src="/johannes.webp" alt={t("home.quote.author")} fill className="object-cover" sizes="(max-width: 768px) 96px, 128px" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t("home.services.expert_cta")}</h3>
                <p className="text-muted-foreground text-lg">{t("home.services.expert_desc")}</p>
              </div>
           </div>
           <a href="https://wa.me/358505633097" target="_blank" rel="noreferrer" className="w-full md:w-auto">
             <Button size="lg" className="w-full md:w-auto h-14 px-8 font-bold text-lg shadow-md hover:scale-105 transition-transform">
                {t("nav.contact_us")} <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
           </a>
        </section>
        <div className="mt-20 container px-4 md:px-6">
          <TrainingSEO />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-16 max-w-6xl">
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary border border-primary/20">
             Professional Performance
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Training & Results Service
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
             Eqilo provides end-to-end support for competition organizers. We ensure the technology is seamless and results are accurate – so you can focus on the sport.
          </p>
        </div>
        <div className="flex-1 w-full max-w-lg aspect-[4/3] rounded-[2rem] border shadow-xl relative overflow-hidden">
           <Image src="/events/horse-park-tour-setup-mirka.jpg" alt="Horse park tour setup" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-24">
         <Card className="border-border/50 shadow-sm p-4">
            <CardHeader>
               <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Presentation className="w-7 h-7 text-primary" />
               </div>
               <CardTitle className="text-2xl font-bold">Training Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-muted-foreground">We train your staff to efficiently operate FDS Timing hardware and Equipe software.</p>
               <ul className="space-y-2">
                  {["Basic timekeeping courses", "Advanced software training", "Troubleshooting & maintenance"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium">
                       <CheckCircle2 className="w-4 h-4 text-primary" /> {item}
                    </li>
                  ))}
               </ul>
            </CardContent>
         </Card>

         <Card className="border-border/50 shadow-sm p-4">
            <CardHeader>
               <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Medal className="w-7 h-7 text-primary" />
               </div>
               <CardTitle className="text-2xl font-bold">Results Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-muted-foreground">We manage the technical implementation and result calculations for your major events.</p>
               <ul className="space-y-2">
                  {["Real-time result processing", "Live-streaming integration", "Official validation"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium">
                       <CheckCircle2 className="w-4 h-4 text-primary" /> {item}
                    </li>
                  ))}
               </ul>
            </CardContent>
         </Card>
      </div>

      <section className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
         <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden border-4 border-background shadow-xl relative">
               <Image src="/johannes.webp" alt={t("home.quote.author")} fill className="object-cover" sizes="(max-width: 768px) 96px, 128px" />
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t("home.services.expert_cta")}</h3>
               <p className="text-muted-foreground text-lg">{t("home.services.expert_desc")}</p>
            </div>
         </div>
         <a href="https://wa.me/358505633097" target="_blank" rel="noreferrer" className="w-full md:w-auto">
           <Button size="lg" className="w-full md:w-auto h-14 px-8 font-bold text-lg shadow-md hover:scale-105 transition-transform">
              {t("nav.contact_us")} <ArrowRight className="ml-2 w-5 h-5" />
           </Button>
         </a>
      </section>
      <div className="mt-20 container px-4 md:px-6">
        <TrainingSEO />
      </div>
    </div>
  );
}
