import { profile } from "@/data/profile";
import { hero } from "@/data/home";
import type { Translate } from "@/i18n";
import { CloseIcon, Equalizer } from "../ui/Icons";

export function Loader({ t }: { t: Translate }) {
  return (
    <div id="loader" role="dialog" aria-label="Loading">
      <div className="l-top">
        <span>{profile.name}</span>
        <span className="l-coord">{profile.coordinates}</span>
        <span>{t(hero.edition)}</span>
      </div>
      <div className="l-enter3" id="lEnter">
        <button className="l-go3" id="lGo">
          {t("Click anywhere to enter")}
        </button>
        <button className="chip" id="lSound" aria-pressed="true">
          <Equalizer />
          <span id="lSoundT">{t("With sound")}</span>
        </button>
      </div>
      <div className="l-bot">
        <div className="odo-w" aria-hidden="true">
          <div className="odo">
            {[0, 1, 2].map((col) => (
              <span className="col" key={col}>
                {Array.from({ length: 11 }, (_, i) => (
                  <span key={i}>{i % 10}</span>
                ))}
              </span>
            ))}
          </div>
          <i>%</i>
        </div>
        <span className="l-word3" id="lWord" aria-live="polite" />
      </div>
      <div className="l-bar">
        <i id="lBar" />
      </div>
    </div>
  );
}

export function Palette({ t }: { t: Translate }) {
  return (
    <div id="pal" role="dialog" aria-modal="true" aria-label={t("Search")}>
      <div className="pal-bg" />
      <div className="pal-box">
        <label className="sr" htmlFor="palIn">
          {t("Search pages, projects and essays")}
        </label>
        <input id="palIn" placeholder={t("Jump to a page, project, essay or action")} autoComplete="off" />
        <ul className="pal-list" id="palList" role="listbox" />
        <div className="pal-foot">
          <span>
            <span className="kbd">↑↓</span> {t("move")}
          </span>
          <span>
            <span className="kbd">↵</span> {t("open")}
          </span>
          <span>
            <span className="kbd">esc</span> {t("close")}
          </span>
        </div>
      </div>
    </div>
  );
}

export function SketchStage({ t }: { t: Translate }) {
  return (
    <div id="labStage" role="dialog" aria-modal="true" aria-label={t("Experiment")}>
      <canvas id="labCanvas" />
      <div className="ls-ui">
        <div>
          <b id="labT" />
          <small id="labH" />
        </div>
        <button className="close" id="labClose">
          {t("Close")}
        </button>
      </div>
      <div className="ctrl" id="labCtrl" />
    </div>
  );
}

export function Lightbox({ t }: { t: Translate }) {
  return (
    <div id="lb" role="dialog" aria-modal="true" aria-label="Screen gallery">
      <div className="lb-bg" />
      <div className="lb-top">
        <span id="lbCount">01 / 01</span>
        <span id="lbTitle" />
        <button className="chip" id="lbClose">
          {t("Close")}
        </button>
      </div>
      <div className="lb-stage" id="lbStage" data-drag="Drag" data-cursor-offset="24">
        <div className="lb-track" id="lbTrack" aria-live="polite" />
      </div>
      <button className="lb-arrow lb-arrow-prev" id="lbPrev" aria-label="Previous screen">
        <svg viewBox="0 0 24 24">
          <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
      <button className="lb-arrow lb-arrow-next" id="lbNext" aria-label="Next screen">
        <svg viewBox="0 0 24 24">
          <path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
      <div className="lb-thumbs" id="lbThumbs" data-lenis-prevent />
    </div>
  );
}

export function Director({ t }: { t: Translate }) {
  return (
    <>
      <button
        className="dir-btn"
        id="dirBtn"
        type="button"
        aria-expanded="false"
        aria-controls="dirPanel"
        aria-label={t("Ask the Director")}
        data-cursor={t("Ask me")}
      >
        <span className="dir-face" id="dirFace" />
        <svg className="dir-fallback" viewBox="0 0 60 60" aria-hidden="true">
          <defs>
            <radialGradient id="dg" cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".4" stopColor="#B9A7FF" />
              <stop offset="1" stopColor="#15172a" />
            </radialGradient>
          </defs>
          <circle cx="30" cy="30" r="27" fill="url(#dg)" />
        </svg>
        <span className="dir-dot" aria-hidden="true" />
      </button>
      <section className="dir-panel" id="dirPanel" role="dialog" aria-label={t("Ask the Director")} hidden>
        <span className="dir-grab" aria-hidden="true" />
        <header className="dir-h">
          <div>
            <b>{t("The Director")}</b>
            <span id="dirState">{t("Listening")}</span>
          </div>
          <a className="chip" href="/ask" id="dirFull">
            {t("Full page")}
          </a>
          <button className="ib" type="button" id="dirClose" aria-label={t("Close")}>
            <CloseIcon />
          </button>
        </header>
        <div className="dir-chat" id="dirChat" />
      </section>
      <div className="dir-fig" id="dirFig" hidden title={t("Poke the Director")}>
        <span className="dir-shadow" aria-hidden="true" />
        <span className="dir-fig-face" id="dirFigFace" />
        <span className="dir-fig-glow" aria-hidden="true" />
      </div>
    </>
  );
}

export function ProjectOpening({ t }: { t: Translate }) {
  return (
    <div id="pload" aria-hidden="true">
      <div className="pl-bg" id="plBg">
        <div className="pl-vis" id="plVis" />
        <img id="plImg" alt="" />
      </div>
      <div className="pl-in">
        <div className="pl-top">
          <span id="plMeta">{t("Project")}</span>
          <span>{t("Loading the case study")}</span>
        </div>
        <div>
          <div className="pl-t" id="plT" />
          <p id="plSub" className="pl-sub" />
        </div>
        <div className="pl-bot">
          <span id="plC" className="pl-c" />
          <span className="pl-n" id="plN">
            000
          </span>
        </div>
      </div>
      <div className="pl-bar">
        <i id="plBar" />
      </div>
    </div>
  );
}

export function Hud() {
  return (
    <>
      <div className="hud l" aria-hidden="true">
        <span id="hudSec" />
        <span className="hb">
          <i id="hudBar" />
        </span>
      </div>
      <div className="hud r" aria-hidden="true">
        <span>{profile.coordinates}</span>
        <span data-clock />
      </div>
    </>
  );
}

export function TransitionLabel() {
  return (
    <div id="curtainLabel" aria-hidden="true">
      <div className="cl-box">
        <div className="cl-route">
          <span className="cl-from" />
          <i className="cl-line">
            <b />
          </i>
          <span className="cl-to" />
        </div>
        <span className="cl-t" />
      </div>
    </div>
  );
}

export function CursorLayer() {
  return (
    <>
      <div className="lens-dot" id="curDot" aria-hidden="true" />
      <div className="lens" id="curRing" aria-hidden="true">
        <span className="cl" id="curLabel" />
      </div>
    </>
  );
}
