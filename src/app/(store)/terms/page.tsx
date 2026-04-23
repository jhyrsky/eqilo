"use client";

import { useLanguage } from "@/components/language-provider";
import { SEOContent as TermsSEO } from "@/components/seo/TermsSEO";

export default function TermsPage() {
  const { lang } = useLanguage();

  if (lang === "FI") {
    return (
      <div className="container py-10 md:py-16 max-w-4xl prose prose-sm md:prose-base dark:prose-invert mx-auto text-foreground">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Käyttöehdot</h1>
        <p className="text-muted-foreground italic mb-10">Viimeksi päivitetty: 13. huhtikuuta 2026</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">1. Yleistä</h2>
          <p>Näitä sopimusehtoja sovelletaan Eqilo Oy:n (jäljempänä &quot;Eqilo&quot;) ja sen asiakkaiden välisessä kauppasuhteessa. Eqilo pidättää oikeuden muuttaa näitä ehtoja yksipuolisesti ilman ennakkoilmoitusta.</p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold">2. Hinnat ja tuotteet</h2>
          <p>Tuotteiden hinnat sisältävät voimassa olevan arvonlisäveron (25,5 % yleinen kanta, ellei toisin mainita). Hinnat eivät sisällä toimituskuluja, ellei toisin mainita. Eqilo pidättää oikeuden peruuttaa tilauksen, mikäli tuotteen hinta on ollut verkkokaupassa selvästi virheellinen.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">3. Toimitus</h2>
          <p>Toimitamme tuotteita pääsääntöisesti Suomeen. Vakiotoimitusaika FDS Timing -laitteille on 1-2 viikkoa. Arvioitu toimitusmaksu on 20 € alle 200 € tilauksille, ja ilmainen yli 200 € tilauksille.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">4. Maksutavat</h2>
          <p>Käytämme Stripe-maksunvälityspalvelua. Voit maksaa pankki- ja luottokorteilla, Apple Paylla, Google Paylla sekä MobilePaylla. Yritysasiakkaille on mahdollista tarjota laskutusvaihtoehto erillisen sopimuksen mukaan (Y-tunnus vaaditaan).</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">5. Palautusoikeus</h2>
          <p>Kuluttaja-asiakkailla on Suomen kuluttajansuojalain mukainen 14 vuorokauden vaihto- ja palautusoikeus. Palautettavan tuotteen on oltava käyttämätön, myyntikuntoinen ja alkuperäisessä pakkauksessaan. Jos haluat palauttaa tuotteen, ota meihin ensin yhteyttä ohjeiden saamiseksi. Palautuksesta aiheutuvista toimituskuluista vastaa asiakas, ellei tuote ole ollut viallinen tai väärin toimitettu. Räätälöidyillä tai erikoistilatuilla tuotteilla (esim. ohjelmistolisenssit) ei ole palautusoikeutta.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">6. Virhevastuu ja reklamaatiot</h2>
          <p>Eqilo Oy vastaa tuotteiden lakisääteisestä virhevastuusta Suomen kuluttajansuojalain mukaisesti. Mikäli toimitettu tuote on viallinen, asiakkaan tulee ilmoittaa virheestä viipymättä asiakaspalveluumme. Eqilo korjaa, vaihtaa tai hyvittää viallisen tuotteen.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">7. Tietosuoja</h2>
          <p>Käsittelemme asiakkaiden henkilötietoja luottamuksellisesti ja soveltuvan tietosuojalainsäädännön (GDPR) mukaisesti. Tietoja käytetään ainoastaan tilauksien käsittelyyn, toimitukseen ja asiakassuhteen hoitamiseen. Tarkemmat tiedot löytyvät erillisestä tietosuojaselosteestamme.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">8. Ylivoimainen este (Force Majeure)</h2>
          <p>Eqilo ei vastaa viivästyksistä tai vahingoista, jotka johtuvat sen vaikutusmahdollisuuksien ulkopuolella olevasta esteestä (esim. sota, luonnonmullistus, lakko, pandemian aiheuttamat toimitusvaikeudet), jota se ei ole voinut kohtuudella ennakoida tai välttää.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">9. Sovellettava laki ja riitojen ratkaisu</h2>
          <p>Näihin ehtoihin sovelletaan Suomen lakia. Mahdolliset erimielisyydet pyritään ratkaisemaan ensisijaisesti neuvottelemalla. Mikäli kuluttaja-asiakkaan ja Eqilon välistä erimielisyyttä ei saada ratkaistua osapuolten välisillä neuvotteluilla, kuluttaja voi saattaa asian kuluttajariitalautakunnan ratkaistavaksi.</p>
        </section>

        <div className="mt-20 p-8 bg-muted/30 rounded-2xl border border-border/50 text-center">
          <h3 className="text-lg font-bold mb-2">Onko kysyttävää?</h3>
          <p className="text-sm text-muted-foreground mb-4">Asiakaspalvelumme auttaa mielellään kaikissa sopimusasioissa.</p>
          <a href="tel:+358505633097" className="font-bold text-primary hover:underline">+358 50 5633097</a>
        </div>
      </div>
    );
  }

  if (lang === "SE") {
    return (
      <div className="container py-10 md:py-16 max-w-4xl prose prose-sm md:prose-base dark:prose-invert mx-auto text-foreground">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Villkor</h1>
        <p className="text-muted-foreground italic mb-10">Senast uppdaterad: 13 april 2026</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">1. Allmänt</h2>
          <p>Dessa villkor gäller för det kommersiella förhållandet mellan Eqilo Oy (&quot;Eqilo&quot;) och dess kunder. Eqilo förbehåller sig rätten att ensidigt ändra dessa villkor utan föregående meddelande.</p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold">2. Priser och produkter</h2>
          <p>Produktpriserna inkluderar tillämplig mervärdesskatt (25,5 % allmän sats om inget annat anges). Priserna inkluderar inte leveranskostnader om inget annat anges. Eqilo förbehåller sig rätten att annullera en beställning om priset på produkten i webbutiken har varit uppenbart felaktigt.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">3. Leverans</h2>
          <p>Vi levererar i huvudsak produkter till Finland. Standardleveranstiden för FDS Timing-enheter är 1-2 veckor. Leveransavgiften är 20 € för beställningar under 200 €, och gratis för beställningar över 200 €.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">4. Betalningsmetoder</h2>
          <p>Vi använder betaltjänsten Stripe. Du kan betala med bank- och kreditkort, Apple Pay, Google Pay och MobilePay. För företagskunder är det möjligt att erbjuda ett faktureringsalternativ enligt ett separat avtal (FO-nummer krävs).</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">5. Ångerrätt och returpolicy</h2>
          <p>Konsumentkunder har 14 dagars bytes- och returrätt i enlighet med den finska konsumentskyddslagen. Den returnerade produkten måste vara oanvänd, i säljbart skick och i sin originalförpackning. Om du vill returnera en produkt, vänligen kontakta oss först för att få instruktioner. Kunden ansvarar för returfraktkostnaderna, såvida inte produkten var defekt eller felaktigt levererad. Skräddarsydda eller specialbeställda produkter (t.ex. programvarulicenser) har ingen returrätt.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">6. Ansvar för fel och reklamationer</h2>
          <p>Eqilo Oy ansvarar för lagstadgat felansvar för produkter i enlighet med den finska konsumentskyddslagen. Om den levererade produkten är defekt måste kunden omedelbart meddela vår kundtjänst. Eqilo kommer att reparera, byta ut eller återbetala den defekta produkten.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">7. Dataskydd</h2>
          <p>Vi behandlar kundernas personuppgifter konfidentiellt och i enlighet med tillämplig dataskyddslagstiftning (GDPR). Uppgifterna används endast för orderbehandling, leverans och hantering av kundrelationer. Mer detaljerad information finns i vår separata integritetspolicy.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">8. Force Majeure</h2>
          <p>Eqilo ansvarar inte för förseningar eller skador orsakade av ett hinder utanför dess kontroll (t.ex. krig, naturkatastrof, strejk, leveranssvårigheter orsakade av en pandemi) som det inte rimligen kunde ha förutsett eller undvikit.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold">9. Tillämplig lag och tvistlösning</h2>
          <p>Dessa villkor styrs av finsk lag. Eventuella tvister ska i första hand lösas genom förhandling. Om en tvist mellan en konsumentkund och Eqilo inte kan lösas genom förhandlingar mellan parterna, kan konsumenten hänskjuta ärendet till konsumenttvistenämnden.</p>
        </section>

        <div className="mt-20 p-8 bg-muted/30 rounded-2xl border border-border/50 text-center">
          <h3 className="text-lg font-bold mb-2">Har du frågor?</h3>
          <p className="text-sm text-muted-foreground mb-4">Vår kundtjänst hjälper gärna till med alla avtalsfrågor.</p>
          <a href="tel:+358505633097" className="font-bold text-primary hover:underline">+358 50 5633097</a>
        </div>

        <TermsSEO />
        </div>
        );
        }
  return (
    <div className="container py-10 md:py-16 max-w-4xl prose prose-sm md:prose-base dark:prose-invert mx-auto text-foreground">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Terms & Conditions</h1>
      <p className="text-muted-foreground italic mb-10">Last updated: April 13, 2026</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold">1. General</h2>
        <p>These terms and conditions apply to the commercial relationship between Eqilo Oy (&quot;Eqilo&quot;) and its customers. Eqilo reserves the right to change these terms unilaterally without prior notice.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold">2. Prices and Products</h2>
        <p>Product prices include the applicable VAT (25.5% general rate unless otherwise stated). Prices do not include delivery costs unless otherwise stated. Eqilo reserves the right to cancel an order if the price of the product in the online store has been clearly incorrect.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold">3. Delivery</h2>
        <p>We primarily deliver products to Finland. The standard delivery time for FDS Timing devices is 1-2 weeks. The delivery fee is €20 for orders under €200, and free for orders over €200.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold">4. Payment Methods</h2>
        <p>We use the Stripe payment service. You can pay with debit and credit cards, Apple Pay, Google Pay, and MobilePay. For business customers, it is possible to offer an invoicing option according to a separate agreement (Business ID required).</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold">5. Right of Return & Refund Policy</h2>
        <p>Consumer customers have a 14-day right of exchange and return in accordance with the Finnish Consumer Protection Act. The returned product must be unused, in salable condition, and in its original packaging. If you wish to return a product, please contact us first to receive instructions. The customer is responsible for the return shipping costs, unless the product was defective or incorrectly delivered. Customized or special-ordered products (e.g., software licenses) do not have a right of return.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold">6. Liability for Defects & Claims</h2>
        <p>Eqilo Oy is responsible for the statutory liability for product defects in accordance with the Finnish Consumer Protection Act. If the delivered product is defective, the customer must notify our customer service without delay. Eqilo will repair, replace, or refund the defective product.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold">7. Privacy Policy</h2>
        <p>We process customers&apos; personal data confidentially and in accordance with applicable data protection legislation (GDPR). The data is used solely for order processing, delivery, and managing the customer relationship. More detailed information can be found in our separate Privacy Policy.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold">8. Force Majeure</h2>
        <p>Eqilo is not liable for delays or damages caused by an obstacle beyond its control (e.g., war, natural disaster, strike, delivery difficulties caused by a pandemic) that it could not reasonably have foreseen or avoided.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold">9. Applicable Law & Dispute Resolution</h2>
        <p>These terms and conditions are governed by Finnish law. Any disputes shall primarily be resolved through negotiation. If a dispute between a consumer customer and Eqilo cannot be resolved through negotiations between the parties, the consumer may refer the matter to the Consumer Disputes Board.</p>
      </section>

      <div className="mt-20 p-8 bg-muted/30 rounded-2xl border border-border/50 text-center">
        <h3 className="text-lg font-bold mb-2">Any Questions?</h3>
        <p className="text-sm text-muted-foreground mb-4">Our customer service is happy to help with any contractual matters.</p>
        <a href="tel:+358505633097" className="font-bold text-primary hover:underline">+358 50 5633097</a>
      </div>
    </div>
  );
}
