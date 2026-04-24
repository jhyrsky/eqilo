"use client";

import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import Image from "next/image";
import sportsData from "@/data/sports.json";

export default function SportsPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="container py-10 md:py-16 max-w-5xl mx-auto text-foreground">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          {lang === "FI" ? "Lajit" : lang === "SE" ? "Sporter" : "Sports"}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {lang === "FI"
            ? "Tutustu ammattilaistason FDS Timing -ajanottoratkaisuihin eri urheilulajeille. Valitse lajisi nähdäksesi tarkemmat ratkaisut."
            : lang === "SE"
            ? "Utforska professionella FDS Timing-lösningar för olika sporter. Välj din sport för att se specifika lösningar."
            : "Explore professional FDS Timing solutions for various sports. Select your sport to see specific solutions."}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sportsData.map((sport) => {
          const title = lang === "FI" ? sport.title_fi : lang === "SE" ? sport.title_se : sport.title_en;
          return (
            <Link
              key={sport.slug}
              href={`/sports/${sport.slug}`}
              className="group bg-card text-card-foreground border border-border/50 rounded-3xl hover:shadow-xl transition-all hover:border-primary/40 flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl">
                <Image
                  src={`/sports/${sport.slug}.webp`}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-tight">{title}</h2>
                <div className="text-primary font-bold mt-auto pt-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                  {t("home.advantage.more.title") || "Lue lisää"} &rarr;
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
