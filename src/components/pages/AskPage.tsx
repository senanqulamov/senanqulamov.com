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
          <div className="ask-stage" id="askStage" data-cursor={t("Poke")}>
            <div className="stage-top">
              <span className="tag" id="askState">
                {t("Listening")}
              </span>
              <button className="chip" id="voiceBtn" aria-pressed="false">
                {t("Voice off")}
              </button>
            </div>
            <div className="face-slot" id="faceSlot" aria-hidden="true" />
            <div className="stage-bot">
              <b>{t("The Director")}</b>
              <p>
                {t(
                  "Move your cursor and the Director will follow it. Click the face to start a conversation.",
                )}
              </p>
            </div>
          </div>
          <div className="chat glass fade" id="askChat" />
        </div>
      </section>
      <Footer t={t} />
    </>
  );
}
