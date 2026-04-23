
"use client";
import { useLanguage } from "@/components/language-provider";

export function SEOContent() {
  const { lang } = useLanguage();
  
  if (lang === "FI") {
    return (
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-20 pt-10 border-t border-border/50 text-muted-foreground">
        <p className="mb-4">Tarkka ajanotto on vain puolet onnistuneesta tulospalvelusta; toinen puoli muodostuu osaavasta henkilökunnasta. Eqilo Oy:n järjestämät koulutus- ja tulospalveluratkaisut tähtäävät siihen, että seurat ja tapahtumajärjestäjät voivat operoida ammattimaisia järjestelmiä itsenäisesti ja itsevarmasti.</p>
        <p className="mb-4">Koulutusohjelmamme kattavat sekä FDS Timing -laitteiston fyysisen asennuksen että Equipe APP -ohjelmiston käytön. Kokeneet asiantuntijamme ohjaavat teidät kädestä pitäen läpi koko prosessin, laitteiden kytkemisestä monimutkaisten kilpailusääntöjen konfigurointiin. Tarjoamme myös paikalla olevaa tulospalvelutukea suurimpiin tapahtumiin, varmistaen niiden sujuvuuden.</p>
        <p className="mb-4">Eqilon tavoitteena on nostaa suomalaisen urheilutapahtumien tasoa. Tarjoamalla ensiluokkaista koulutusta ja tukea varmistamme, että teknologia toimii renkinä, ei isäntänä. Ota yhteyttä, ja suunnitellaan juuri teidän tarpeisiinne sopiva koulutus- tai palvelupaketti.</p>
      </div>
    );
  }
  
  if (lang === "SE") {
    return (
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-20 pt-10 border-t border-border/50 text-muted-foreground">
        <p className="mb-4">Exakt tidtagning är bara hälften av en framgångsrik resultattjänst; den andra hälften består av kompetent personal. Eqilo Oys lösningar för utbildning och resultattjänster syftar till att säkerställa att klubbar och evenemangsorganisatörer kan hantera professionella system självständigt och med självförtroende.</p>
        <p className="mb-4">Våra utbildningsprogram omfattar både den fysiska installationen av FDS Timing-utrustning och användningen av Equipe APP-programvaran. Våra erfarna experter guidar dig hand i hand genom hela processen, från att ansluta enheterna till att konfigurera komplexa tävlingsregler. Vi erbjuder också resultattjänstsupport på plats för de största evenemangen, vilket säkerställer att de fungerar smidigt.</p>
        <p className="mb-4">Eqilos mål är att höja standarden på finska idrottsevenemang. Genom att tillhandahålla förstklassig utbildning och support säkerställer vi att tekniken fungerar som en tjänare, inte som en herre. Kontakta oss så designar vi ett utbildnings- eller servicepaket skräddarsytt för just dina behov.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-20 pt-10 border-t border-border/50 text-muted-foreground">
      <p className="mb-4">Accurate timekeeping is only half of a successful results service; the other half consists of competent staff. Eqilo Oy's training and results service solutions aim to ensure that clubs and event organizers can operate professional systems independently and confidently.</p>
      <p className="mb-4">Our training programs cover both the physical installation of FDS Timing equipment and the use of the Equipe APP software. Our experienced experts guide you hand-in-hand through the entire process, from connecting the devices to configuring complex competition rules. We also provide on-site results service support for the largest events, ensuring their smooth operation.</p>
      <p className="mb-4">Eqilo's goal is to raise the standard of sports events. By providing first-class training and support, we ensure that technology acts as a servant, not a master. Contact us, and let's design a training or service package tailored to your exact needs.</p>
    </div>
  );
}
