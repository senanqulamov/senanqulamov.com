import type { Translate } from "@/i18n";
import { Footer } from "../shell/Footer";
import { PageHead } from "../ui/PageHead";

export function AskPage({ t }: { t: Translate }) {
  return (
    <>
      <PageHead
        t={t}
        crumb="Ask the Director"
        title="Ask the director"
        lede="An assistant that knows my work, services and prices. Ask anything, and it can prepare your project brief for you."
        scene="ask"
      />
      <section data-s="askface">
        <div className="ask-wrap">
          <aside className="ask-stage" id="askStage" data-cursor={t("Poke")}>
            <div className="ask-orb">
              <div className="ask-glow" aria-hidden="true" />
              <div className="face-slot" id="faceSlot" aria-hidden="true" />
              <p className="ask-poke" id="askPoke" role="status" />
            </div>
            <div className="stage-bot">
              <b>{t("The Director")}</b>
              <span id="askState">{t("Listening")}</span>
              <p>
                {t(
                  "Move your cursor and the Director will follow it. Click the face to start a conversation.",
                )}
              </p>
            </div>
          </aside>
          <div className="ask-chat fade" id="askChat" />
        </div>
      </section>
      <Footer t={t} />
    </>
  );
}
