import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const reduce =
  matchMedia("(prefers-reduced-motion: reduce)").matches || localStorage.getItem("sq-reduce") === "1";

export const coarse = matchMedia("(pointer: coarse)").matches;

// Pointer type and viewport are not a useful proxy for GPU capability. Phones
// start at full fidelity and the renderer's FPS loop is allowed to step down.
export const lowEnd = (navigator.hardwareConcurrency || 8) <= 4;

/** Phones and small tablets get shorter, lighter motion. */
export const isMobile = () => innerWidth < 820 || coarse;
