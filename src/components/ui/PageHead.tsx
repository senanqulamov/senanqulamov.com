import type { ReactNode } from "react";
import type { Translate } from "@/i18n";

type Props = {
  t: Translate;
  crumb: string;
  title: string;
  lede?: string;
  scene?: string;
  children?: ReactNode;
};

export function PageHead({ t, crumb, title, lede, scene = "page", children }: Props) {
  return (
    <section className="page-head" data-s={scene}>
      <div className="crumb">
        <a href="/">{t("Home")}</a>
        <span>/</span>
        <span>{t(crumb)}</span>
      </div>
      <h1 className="h-xl" data-split>
        {t(title)}
      </h1>
      {lede && <p className="lede fade">{t(lede)}</p>}
      {children}
    </section>
  );
}
