"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, BookOpen, Wrench, Trophy, Activity, Medal } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SEOContent as ServicesSEO } from "@/components/seo/ServicesSEO";

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <div className="container py-10 md:py-16 max-w-6xl">
      <div className="space-y-6 mb-16 text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary tracking-wide uppercase">
          {t("nav.consulting")}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
          {t("services.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {t("nav.consulting_desc")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        
        {/* Training & Results Service */}
        <Card className="flex flex-col border-border/50 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
          <div className="relative h-52 overflow-hidden">
            <Image
              src="/events/equestrian-outdoor-fds-tripod-finland.jpg"
              alt="FDS Timing equipment setup at a Finnish equestrian event"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <CardHeader className="pt-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Medal className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">{t("nav.training")}</CardTitle>
            <CardDescription className="text-lg font-medium mt-2">
              {t("services.training_desc_short")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <p className="text-muted-foreground leading-relaxed text-base">
              {t("services.training_full")}
            </p>
            <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
              <ul className="space-y-3 text-sm font-semibold text-foreground">
                <li className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-primary" /> {t("services.feature.on_site")}</li>
                <li className="flex items-center gap-3"><Wrench className="w-5 h-5 text-primary" /> {t("services.feature.setup")}</li>
                <li className="flex items-center gap-3"><Trophy className="w-5 h-5 text-primary" /> {t("services.feature.live")}</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-8 mt-auto">
            <Link href="/services/training-and-results" className="w-full">
              <Button className="w-full h-14 text-lg font-bold shadow-md group-hover:bg-primary/90 transition-colors">
                {t("services.training_cta")} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Equipe Software */}
        <Card className="flex flex-col border-border/50 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
          <div className="relative h-52 overflow-hidden">
            <Image
              src="/events/equestrian-indoor-arena-scoreboard.jpg"
              alt="Live results scoreboard at an indoor equestrian arena"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <CardHeader className="pt-8">
            <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden p-1">
              <Image src="/logos/equipe-logo.png" alt="Equipe" width={56} height={56} className="object-contain" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">{t("nav.equipe")}</CardTitle>
            <CardDescription className="text-lg font-medium mt-2">
              {t("services.equipe_desc_short")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <p className="text-muted-foreground leading-relaxed text-base">
              {t("services.equipe_full")}
            </p>
            <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
              <ul className="space-y-3 text-sm font-semibold text-foreground">
                <li className="flex items-center gap-3"><Wrench className="w-5 h-5 text-secondary-foreground" /> {t("services.feature.bridge")}</li>
                <li className="flex items-center gap-3"><Activity className="w-5 h-5 text-secondary-foreground" /> {t("services.feature.auto")}</li>
                <li className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-secondary-foreground" /> {t("services.feature.config")}</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-8 mt-auto">
            <Link href="/services/equipe-software" className="w-full">
              <Button className="w-full h-14 text-lg font-bold shadow-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                {t("services.equipe_cta")} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

      </div>
      <div className="mt-20">
        <ServicesSEO />
      </div>
    </div>
  );
}
