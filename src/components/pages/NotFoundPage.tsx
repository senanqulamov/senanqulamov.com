import type { Translate } from "@/i18n";
import { Roll } from "../ui/Roll";

export function NotFoundPage({ t }: { t: Translate }) {
  return (
    <section className="nf" data-s="notfound" data-drag={t("Pull")}>
      <title>{`${t("Lost.")} · Senan Qulamov`}</title>
      <div className="nf-in">
        <span className="tag">{t("Error 404")}</span>
        <h1 className="h-xl" data-split>
          {t("Lost.")}
        </h1>
        <p className="lede">{t("This scene was cut from the final edit. Two drops, one way home.")}</p>
        <p className="nf-hint" id="nfHint">
          {t("Drag anywhere to pull the drops together")}
        </p>
        <div className="nf-meter" aria-hidden="true">
          <i id="nfBar" />
        </div>
        <div className="btn-row centered">
          <a className="btn ghost" href="/">
            <Roll text={t("Or just go home")} />
          </a>
          <a className="btn ghost" href="/work">
            <Roll text={t("Browse the work")} />
          </a>
        </div>
      </div>
    </section>
  );
}
