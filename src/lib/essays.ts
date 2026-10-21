import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderMarkdown } from "./markdown";

export async function loadEssay(slug: string) {
  const file = path.join(process.cwd(), "src/content/essays", `${slug}.md`);
  return renderMarkdown(await readFile(file, "utf8"));
}
