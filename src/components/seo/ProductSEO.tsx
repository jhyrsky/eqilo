
"use client";
import { useLanguage } from "@/components/language-provider";

export function SEOContent() {
  const { lang } = useLanguage();
  
  if (lang === "FI") {
    return (
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-20 pt-10 border-t border-border/50 text-muted-foreground">
        <p className="mb-4">FDS Timing -tuotteet ovat osoitus sveitsiläisestä insinööritaidosta, jossa yhdistyvät äärimmäinen tarkkuus ja luotettavuus. Ne on suunniteltu kestämään kovaa käyttöä ja vaihtelevia sääolosuhteita ja luotettava valinta ammattilaistason ajanottoon ja tulospalveluun.</p>
        <p className="mb-4">Yhteensopivuus alan standardiohjelmistojen, kuten Equipe APP:n, kanssa takaa saumattoman integraation ja tehokkaan kilpailun läpiviennin. Eqilo tarjoaa tuen ja opastuksen tuotteen käyttöönotossa, varmistaen parhaan mahdollisen käyttökokemuksen.</p>
      </div>
    );
  }
  
  if (lang === "SE") {
    return (
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-20 pt-10 border-t border-border/50 text-muted-foreground">
        <p className="mb-4">Denna FDS Timing-produkt är ett bevis på schweizisk ingenjörskonst, som kombinerar extrem precision och tillförlitlighet. Den är designad för att tåla hård användning och varierande väderförhållanden och är ett pålitligt val för tidtagning och resultattjänster på professionell nivå.</p>
        <p className="mb-4">Kompatibilitet med branschstandardiserad programvara, såsom Equipe APP, säkerställer sömlös integration och effektiv tävlingshantering. Eqilo Oy erbjuder fullt stöd och vägledning vid implementering av produkten, vilket säkerställer bästa möjliga användarupplevelse.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-20 pt-10 border-t border-border/50 text-muted-foreground">
      <p className="mb-4">This FDS Timing product is a testament to Swiss engineering, combining extreme precision and reliability. Designed to withstand heavy use and varying weather conditions, it is a dependable choice for professional-level timekeeping and result services.</p>
      <p className="mb-4">Compatibility with industry-standard software, such as the Equipe APP, ensures seamless integration and efficient competition management. Eqilo Oy provides full support and guidance in deploying the product, ensuring the best possible user experience.</p>
    </div>
  );
}
