"use client";

import { useLanguage } from "@/components/language-provider";
import sportsData from "@/data/sports.json";
import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Timer, Trophy, Snowflake, Bike, Car, Activity } from "lucide-react";

export default function SportPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { lang, t } = useLanguage();
  
  const sport = sportsData.find(s => s.slug === resolvedParams.slug);

  if (!sport) {
    notFound();
  }

  const title = lang === "FI" ? sport.title_fi : lang === "SE" ? sport.title_se : sport.title_en;
  const content = lang === "FI" ? sport.content_fi : lang === "SE" ? sport.content_se : sport.content_en;

  const getSportIcon = (slug: string) => {
    switch (slug) {
      case 'equestrian': return <Trophy className="w-24 h-24 text-primary" />;
      case 'agility': return <Activity className="w-24 h-24 text-primary" />;
      case 'athletics': return <Timer className="w-24 h-24 text-primary" />;
      case 'skiing': return <Snowflake className="w-24 h-24 text-primary" />;
      case 'motorsports': return <Car className="w-24 h-24 text-primary" />;
      case 'cycling': return <Bike className="w-24 h-24 text-primary" />;
      default: return <Trophy className="w-24 h-24 text-primary" />;
    }
  };

  const getSportImage = (slug: string) => {
    switch (slug) {
      case 'equestrian': return '/events/equestrian-indoor-ypaja-finland.jpg';
      case 'agility': return '/events/agility-stadium-finland.jpg';
      case 'athletics': return '/events/athletics-finland.jpg';
      case 'skiing': return '/events/skiing-finland.jpg';
      case 'motorsports': return '/sports/motorsports.webp';
      case 'cycling': return '/sports/cycling.webp';
      default: return '/sports/athletics.webp';
    }
  };

  return (
    <div className="container py-10 md:py-16 max-w-4xl mx-auto text-foreground">
      <Link href="/sports" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {lang === "FI" ? "Kaikki lajit" : lang === "SE" ? "Alla sporter" : "All sports"}
      </Link>
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 p-8 bg-muted/20 rounded-3xl border border-border/50 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-background rounded-full flex items-center justify-center border-4 border-muted shadow-xl z-10">
          {getSportIcon(sport.slug)}
        </div>
        <div className="z-10 text-center md:text-left flex-1">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">{title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {lang === "FI" 
              ? "Käyttäjäystävälliset ratkaisut"
              : lang === "SE" 
              ? "Professionella lösningar för din sports specifika krav." 
              : "Professional solutions for the specific demands of your sport."}
          </p>
        </div>
      </div>
      
      <div className="w-full h-64 md:h-96 mb-12 rounded-3xl overflow-hidden shadow-2xl relative border border-border/50">
        <Image 
          src={getSportImage(sport.slug)} 
          alt={title} 
          fill 
          className="object-cover" 
          sizes="(max-width: 1200px) 100vw, 1200px" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
           <p className="font-bold uppercase tracking-widest text-white/80 text-sm mb-2">{lang === "FI" ? "Powered by FDS Timing" : "Powered by FDS Timing"}</p>
        </div>
      </div>

      <div 
        className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground [&>p]:mb-6 [&>p]:text-lg [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:text-foreground [&>h2]:mt-12 [&>h2]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>li]:mb-3 [&>li]:text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }} 
      />

      <section className="mt-24 bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
         <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden border-4 border-background shadow-xl relative">
               <Image src="/johannes.webp" alt={t("home.quote.author")} fill className="object-cover" sizes="(max-width: 768px) 96px, 128px" />
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t("home.services.expert_cta")}</h3>
               <p className="text-muted-foreground text-lg max-w-md">{t("home.services.expert_desc")}</p>
            </div>
         </div>
         <a href="https://wa.me/358505633097" target="_blank" rel="noreferrer" className="w-full md:w-auto">
           <Button size="lg" className="w-full md:w-auto h-14 px-8 font-bold text-lg shadow-md hover:scale-105 transition-transform">
              {t("nav.contact_us")} <ArrowRight className="ml-2 w-5 h-5" />
           </Button>
         </a>
      </section>
    </div>
  );
}