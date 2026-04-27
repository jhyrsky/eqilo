
"use client";
import { useLanguage } from "@/components/language-provider";

export function SEOContent() {
  const { lang } = useLanguage();
  
  if (lang === "FI") {
    return (
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-20 pt-10 border-t border-border/50 text-muted-foreground">
        <p className="mb-4">Equipe APP ja Equipe Online edustavat nykyaikaisen ratsastuskilpailun tulospalvelun ehdotonta kärkeä. Ne on suunniteltu erityisesti ratsastuksen, kuten esteratsastuksen ja kouluratsastuksen, moninaisiin tarpeisiin. Eqilo Oy toimii Equipe-järjestelmien asiantuntijana Suomessa, auttaen seuroja hyödyntämään ohjelmiston koko potentiaalin.</p>
        <p className="mb-4">Saumaton integraatio FDS Timing -laitteiston kanssa tekee Equipe-ohjelmistoista korvaamattoman työkalun. Se siirtää valokennoilta ja kelloilta saadut ajat suoraan reaaliaikaiseen tulospalveluun ja yleisön nähtäville. Koulutuksemme varmistaa, että kilpailun toimihenkilöt hallitsevat ohjelmiston toiminnot rutiinilla ja voivat keskittyä tapahtuman muihin osa-alueisiin.</p>
        <p className="mb-4">Tarjoamme myös etätukea ja ongelmanratkaisua kilpailuviikonloppuina. Näin voitte luottaa siihen, että teknologia toimii moitteettomasti myös paineen alla. Valitsemalla Eqilon ja Equipen, valitsette varmuuden, tehokkuuden ja alan parhaat käytännöt.</p>
      </div>
    );
  }
  
  if (lang === "SE") {
    return (
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-20 pt-10 border-t border-border/50 text-muted-foreground">
        <p className="mb-4">Equipe APP och Equipe Online representerar den absoluta toppen av moderna resultattjänster för ridsporttävlingar. De är specifikt utformade för ridsportens mångfaldiga behov, såsom banhoppning och dressyr. Eqilo fungerar som expert för Equipe-system och hjälper klubbar att utnyttja programvarans fulla potential.</p>
        <p className="mb-4">Sömlös integration med FDS Timing-utrustning gör Equipe-programvaran till ett oumbärligt verktyg. Den överför tider från fotoceller och klockor direkt till realtidsresultattjänsten och för publiken att se. Vår utbildning säkerställer att tävlingsfunktionärerna rutinmässigt behärskar programvarans funktioner och kan fokusera på andra aspekter av evenemanget.</p>
        <p className="mb-4">Vi erbjuder även fjärrsupport och felsökning under tävlingshelger. På så sätt kan du lita på att tekniken fungerar felfritt även under press. Genom att välja Eqilo och Equipe väljer du säkerhet, effektivitet och branschens bästa praxis.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-20 pt-10 border-t border-border/50 text-muted-foreground">
      <p className="mb-4">The Equipe APP and Equipe Online represent the absolute pinnacle of modern equestrian competition results services. They are specifically designed for the diverse needs of equestrian sports, such as show jumping and dressage. Eqilo Oy acts as the expert for Equipe systems, helping organizers harness the software&apos;s full potential.</p>
      <p className="mb-4">Seamless integration with FDS Timing equipment makes Equipe software an indispensable tool. It transfers times received from photocells and clocks directly to the real-time results service and for the audience to see. Our training ensures that competition officials routinely master the software&apos;s functions and can focus on other aspects of the event.</p>
      <p className="mb-4">We also offer remote support and troubleshooting during competition weekends. This way, you can trust that the technology will work flawlessly even under pressure. By choosing Eqilo and Equipe, you choose certainty, efficiency, and the best practices in the field.</p>
    </div>
  );
}
