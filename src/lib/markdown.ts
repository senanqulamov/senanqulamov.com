// A small Markdown renderer for the essays: headings, paragraphs, lists, quotes,
// tables, code blocks, links, bold and italics. Second-level headings become the
// essay's table of contents.

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const inline = (text: string) =>
  escape(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

export type TocEntry = { id: string; title: string };

export function renderMarkdown(source: string) {
  const lines = source.replace(/\r/g, "").split("\n");
  const html: string[] = [];
  const toc: TocEntry[] = [];
  const isList = (l: string) => /^\s*([-*+]|\d+\.)\s+/.test(l);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++;
      html.push(`<pre><code>${escape(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)/);
    if (heading) {
      const level = heading[1].length;
      const title = heading[2].replace(/\*\*/g, "");
      const id = `h-${toc.length}`;
      if (level === 2) toc.push({ id, title });
      html.push(`<h${level} id="${id}">${inline(title)}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
      html.push("<hr>");
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ""));
      html.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);
      continue;
    }

    if (/^\|/.test(line)) {
      const rows: string[] = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = rows
        .filter((r) => !/^\|[\s:|-]+\|?\s*$/.test(r))
        .map((r) =>
          r
            .replace(/^\||\|\s*$/g, "")
            .split("|")
            .map((c) => inline(c.trim())),
        );
      const [head, ...body] = cells;
      html.push(
        `<table><thead><tr>${head.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${body
          .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
          .join("")}</tbody></table>`,
      );
      continue;
    }

    if (isList(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && isList(lines[i])) items.push(lines[i++].replace(/^\s*([-*+]|\d+\.)\s+/, ""));
      const tag = ordered ? "ol" : "ul";
      html.push(`<${tag}>${items.map((x) => `<li>${inline(x)}</li>`).join("")}</${tag}>`);
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>|\||\s*([-*+]|\d+\.)\s)/.test(lines[i])) {
      paragraph.push(lines[i++].trim());
    }
    html.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }

  return { html: html.join("\n"), toc };
}
