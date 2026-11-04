import { essays } from "@/data/essays";
import { profile } from "@/data/profile";
import { pricing } from "@/data/pricing";
import { projects } from "@/data/projects";
import type { Lang, Translate } from "@/i18n";

export function MobileMenu({ t, lang }: { t: Translate; lang: Lang }) {
  const project = projects[0], essay = essays[0], low = Math.min(...Object.values(pricing.services).map((x) => x.from));
  const chips = [["Home","/"],["Ask the Director","#director"],["Credits","/credits"],["Gallery","/gallery"],["Library","/library"],["Lab","/lab"],["Press kit","/press"],["Contact","/contact"]];
  return <>
    <div className="mobile-menu-scrim" id="mobileMenuScrim" />
    <section className="mobile-menu-sheet" id="mobileMenu" role="dialog" aria-modal="true" aria-label={t("Menu")} aria-hidden="true">
      <header className="mm-head">
        <i className="mm-grab" />
        <div className="mm-search-row"><i className="mm-gl-stage" data-gl-stage="blob" data-gl-scale=".9" /><input id="mmSearch" placeholder={t("Search the site")} /></div>
        <div className="mm-tabs" role="tablist"><button role="tab" aria-selected="true" data-mm-tab="pages">{t("Pages")}</button><button role="tab" aria-selected="false" data-mm-tab="settings">{t("Settings")}</button><i /></div>
        <ul className="mm-results" id="mmResults" />
      </header>
      <div className="mm-viewport" id="mmViewport"><div className="mm-track" id="mmTrack">
        <div className="mm-pane mm-pages" id="mmPages">
          <p className="mm-label">{t("What's new")}</p><div className="mm-reel">
            <a className="mm-reel-card mm-premiere" href="/start"><small>{t("Premiere")} · {t(profile.availability)}</small><b>{t("Start a project")}</b><span>{t("From AZN")} {low}</span></a>
            <a className="mm-reel-card mm-project" href={`/work/${project.slug}`} style={{backgroundImage:`linear-gradient(transparent,rgba(0,0,0,.76)),url(${project.cover})`}}><small>{t("Latest project")}</small><b>{project.title}</b><span>{project.type}</span></a>
            <a className="mm-reel-card" href={`/journal/${essay.slug}`}><small>{t("New essay")}</small><b>{essay.title}</b><span>{essay.minutes} {t("minute read")}</span></a>
          </div>
          <div className="mm-live"><a href="/work"><b>{t("Work")}</b><span>{t("Latest")} · {project.title}</span></a><a href="/journal"><b>{t("Journal")}</b><span>{t("New:")} {essay.title}</span></a><a href="/services"><b>{t("Services")}</b><span>{t("From AZN")} {low}</span></a></div>
          <div className="mm-chips">{chips.map(([name,href]) => <a key={name} href={href} data-mm-director={href === "#director" || undefined}>{t(name)}</a>)}</div>
        </div>
        <div className="mm-pane mm-settings" id="mmSettings">
          <p className="mm-label">{t("Appearance")}</p><div className="mm-appearance">{["dark","light","auto"].map(x=><button key={x} data-mm-theme={x} aria-pressed={x === "auto"}><i /><span>{t(x[0].toUpperCase()+x.slice(1))}</span></button>)}</div>
          <p className="mm-label">{t("Language")}</p><div className="mm-languages">{[["en","Hello","English"],["az","Salam","Azərbaycança"],["ru","Привет","Русский"]].map(([code,greeting,name])=><button key={code} data-mm-lang={code} aria-pressed={code===lang}><b>{greeting}</b><span>{name}</span></button>)}</div>
          <p className="mm-label">{t("Sound and motion")}</p><div className="mm-motion"><button data-sound><svg viewBox="0 0 400 48"><path d="M0 24 C35 2 65 46 100 24 S165 2 200 24 S265 46 300 24 S365 2 400 24" /></svg><b>{t("Sound")}</b><span data-sound-label>{t("Off")}</span></button><button id="mmCalm"><i /><b>{t("Motion")}</b><span>{t("Full")}</span></button></div>
          <article className="mm-about"><i /><small>{t("Portfolio · 2026 edition")}</small><b>{t("Designed and built by Senan in Baku.")}</b><span>{t("Next.js · WebGL · GSAP / Real-time chrome, rendered on your phone.")}</span></article>
          <div className="mm-contact"><button data-mm-copy={profile.email}>{profile.email}<span>{t("Copy")}</span></button><a href={profile.linkedin} target="_blank">LinkedIn</a><a href={profile.github} target="_blank">GitHub</a></div>
        </div>
      </div></div>
    </section>
  </>;
}
