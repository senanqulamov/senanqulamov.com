export {};

declare global {
  interface Window {
    gtag?: (command: "config" | "event", target: string, params?: Record<string, unknown>) => void;
  }
}
