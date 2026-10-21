import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const reduce =
  matchMedia("(prefers-reduced-motion: reduce)").matches || localStorage.getItem("sq-reduce") === "1";

export const coarse = matchMedia("(pointer: coarse)").matches;

export const lowEnd = coarse || innerWidth < 820 || (navigator.hardwareConcurrency || 8) <= 4;

/** Phones and small tablets get shorter, lighter motion. */
export const isMobile = () => innerWidth < 820 || coarse;
