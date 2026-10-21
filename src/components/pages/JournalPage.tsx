import { essays } from "@/data/essays";
import type { Lang, Translate } from "@/i18n";
import { EssayRow } from "../journal/EssayRow";
import { Footer } from "../shell/Footer";
import { PageHead } from "../ui/PageHead";

export function JournalPage({ t, lang }: { t: Translate; lang: Lang }) {
  return (
    <>
      <PageHead
        t={t}
        crumb="Journal"
        title="The ideas"
        lede="Notes from both sides of my work: building products as an engineer and founder, and listening to people as a therapist."
        scene="journal"
      />
      <section data-s="journal">
        <ul className="jlist">
          {essays.map((e) => (
            <EssayRow key={e.slug} essay={e} t={t} lang={lang} />
          ))}
        </ul>
      </section>
      <Footer t={t} />
    </>
  );
}
