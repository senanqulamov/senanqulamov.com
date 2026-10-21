// Press kit: the talk invitation form.

import { profile } from "@/data/profile";
import { $ } from "../dom";
import { GL } from "../state";
import { tr } from "../i18n";
import { toast } from "../ui";
import { fieldErr } from "../forms";
import { sendMessage } from "../send";

export function mountPress(view: HTMLElement) {
  const f = $<HTMLFormElement>("#talkForm");
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)) as Record<string, string>;
    const bad: [string, string][] = [];
    if (!d.event) bad.push(["event", tr("Add the event name.")]);
    if (!d.name) bad.push(["name", tr("Add your name.")]);
    if (!/^\S+@\S+\.\S+$/.test(d.email || "")) bad.push(["email", tr("Add a valid email so I can reply.")]);
    if (bad.length) {
      bad.forEach(([k, m]) => fieldErr(k, m, f));
      return;
    }
    const b = $("button[type=submit]", f);
    b.classList.add("loading");
    const bodyTxt = `Event: ${d.event}\nDate: ${d.date || "-"}\nCity or online: ${d.city || "-"}\nAudience size: ${d.size || "-"}\nFormat: ${d.format}\n\nAbout the event:\n${d.about || "-"}\n\n${d.name}\n${d.email}`;
    const subject = "Speaking invitation: " + d.event;
    const sent = await sendMessage({ subject, text: bodyTxt, replyTo: d.email });
    b.classList.remove("loading");
    if (sent) {
      toast("Thank you. The invitation is on its way.");
      f.reset();
    } else {
      location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`;
      toast("Your email app should open with the invitation.");
    }
    GL && GL.burst();
  });
}
