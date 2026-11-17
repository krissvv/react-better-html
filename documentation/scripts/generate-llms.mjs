// Generates the AI friendly versions of the documentation (https://llmstxt.org):
// - static/docs/**/*.md  - a clean markdown copy of every docs page (served at the page URL + ".md")
// - static/llms-full.txt - the preamble of static/llms.txt followed by every page in sidebar order
// - src/generated/aiRule.json - the copy-paste rule for AI tools (rendered by <AiRule /> in the docs)
//
// static/llms.txt is written by hand. This script only checks that it links every docs page.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteUrl = "https://krissvv.github.io/react-better-html";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(rootDir, "docs");
const staticDir = path.join(rootDir, "static");
const markdownOutputDir = path.join(staticDir, "docs");
const llmsFilePath = path.join(staticDir, "llms.txt");
const llmsFullFilePath = path.join(staticDir, "llms-full.txt");
const aiRuleFilePath = path.join(rootDir, "src", "generated", "aiRule.json");

const llmsRulesHeading = "Rules for writing code with react-better-html:";

const admonitionTitles = {
   note: "Note",
   tip: "Tip",
   info: "Info",
   warning: "Warning",
   danger: "Danger",
   caution: "Caution",
};

function parseFrontMatter(content) {
   const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
   if (!match) return { data: {}, body: content };

   const data = {};
   for (const line of match[1].split("\n")) {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) continue;

      data[line.slice(0, separatorIndex).trim()] = line.slice(separatorIndex + 1).trim();
   }

   return { data, body: content.slice(match[0].length) };
}

// Docusaurus serves `form/form.mdx` at `/docs/form` (a doc named like its folder becomes the category index)
function getUrlPath(relativeFilePath) {
   const withoutExtension = relativeFilePath.replace(/\.mdx?$/, "");
   const segments = withoutExtension.split("/");

   if (segments.length > 1 && segments.at(-1) === segments.at(-2)) segments.pop();

   return segments.join("/");
}

function readDocsTree(directory) {
   const items = [];

   for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
         const categoryFilePath = path.join(fullPath, "_category_.json");
         const category = fs.existsSync(categoryFilePath) ? JSON.parse(fs.readFileSync(categoryFilePath, "utf8")) : {};

         items.push({
            name: entry.name,
            position: category.position,
            children: readDocsTree(fullPath),
         });
      } else if (/\.mdx?$/.test(entry.name)) {
         const relativeFilePath = path.relative(docsDir, fullPath).split(path.sep).join("/");
         const { data, body } = parseFrontMatter(fs.readFileSync(fullPath, "utf8"));

         items.push({
            name: entry.name,
            position: data.sidebar_position !== undefined ? Number(data.sidebar_position) : undefined,
            page: {
               relativeFilePath,
               urlPath: getUrlPath(relativeFilePath),
               title: data.title ?? entry.name.replace(/\.mdx?$/, ""),
               description: data.description,
               body,
            },
         });
      }
   }

   return items.sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity) || a.name.localeCompare(b.name));
}

function flattenDocsTree(items) {
   return items.flatMap((item) => (item.children ? flattenDocsTree(item.children) : [item.page]));
}

function resolveLink(link, page) {
   if (link.startsWith("pathname://")) return `${siteUrl}${link.slice("pathname://".length)}`;
   if (/^([a-z]+:|#|\/)/i.test(link)) return link;

   const [target, anchor] = link.split("#");
   const anchorSuffix = anchor ? `#${anchor}` : "";

   // File links (`../button.mdx`) are relative to the file, URL links (`../button`) to the page URL
   const resolvedPath = /\.mdx?$/.test(target)
      ? getUrlPath(path.posix.join(path.posix.dirname(page.relativeFilePath), target))
      : path.posix.join(path.posix.dirname(page.urlPath), target).replace(/\.mdx?$/, "");

   return `${siteUrl}/docs/${resolvedPath}.md${anchorSuffix}`;
}

// The rule users paste in their IDE - the summary and the rules list from static/llms.txt
function createAiRule(llmsContent) {
   const summary = llmsContent.match(/^> (.+)$/m)?.[1];
   const rulesStartIndex = llmsContent.indexOf(llmsRulesHeading);

   if (!summary || rulesStartIndex === -1) {
      throw new Error(`[generate-llms] static/llms.txt must contain a "> summary" line and the "${llmsRulesHeading}" list`);
   }

   const rules = llmsContent
      .slice(rulesStartIndex + llmsRulesHeading.length)
      .split(/\n## /)[0]
      .trim();

   return [
      "# react-better-html",
      summary,
      "Use these rules when writing or editing code that imports from `react-better-html`. When a component, prop or function is not covered here, read the documentation instead of guessing:",
      [
         `- Index of all pages: ${siteUrl}/llms.txt`,
         `- The whole documentation in one file: ${siteUrl}/llms-full.txt`,
         `- Any docs page as markdown: add \`.md\` to its URL (for example ${siteUrl}/docs/components/button.md)`,
      ].join("\n"),
      "## Rules",
      rules,
   ].join("\n\n");
}

function convertMdxToMarkdown(page, aiRule) {
   const output = [];
   const lines = page.body.split("\n");

   let isInCode = false;
   let tabItemDedent = undefined;
   let isInTabItem = false;
   let isInAdmonition = false;
   let htmlDepth = 0;
   let removedTitle = false;
   let pendingAiRuleTag = undefined;

   for (const rawLine of lines) {
      let line = rawLine;

      if (isInTabItem && tabItemDedent === undefined && line.trim() !== "") {
         tabItemDedent = line.match(/^ */)[0].length;
      }
      if (isInTabItem && tabItemDedent) {
         const leadingSpaces = line.match(/^ */)[0].length;
         line = line.slice(Math.min(leadingSpaces, tabItemDedent));
      }

      const fenceMatch = line.match(/^(\s*)```(\S*)/);

      if (isInCode) {
         if (fenceMatch) {
            isInCode = false;
            output.push(`${fenceMatch[1]}\`\`\``);
         } else if (!/^\s*\/\/ highlight-(next-line|start|end)\s*$/.test(line)) {
            output.push(line);
         }
         continue;
      }

      if (fenceMatch) {
         isInCode = true;
         output.push(`${fenceMatch[1]}\`\`\`${fenceMatch[2]}`);
         continue;
      }

      // <AiRule /> can be split on multiple lines
      if (pendingAiRuleTag !== undefined || /^\s*<AiRule\b/.test(line)) {
         pendingAiRuleTag = `${pendingAiRuleTag ?? ""} ${line.trim()}`;
         if (!pendingAiRuleTag.trimEnd().endsWith("/>")) continue;
      }

      const aiRuleMatch = pendingAiRuleTag?.match(/<AiRule\b(.*?)\/>\s*$/);
      pendingAiRuleTag = undefined;
      if (aiRuleMatch) {
         const frontMatterMatch = aiRuleMatch[1].match(/frontMatter=\{("(?:[^"\\]|\\.)*")\}/);
         const ruleContent = frontMatterMatch ? `${JSON.parse(frontMatterMatch[1])}\n\n${aiRule}` : aiRule;

         output.push("```markdown", ruleContent, "```");
         continue;
      }

      // HTML previews (`That renders to:` blocks)
      if (htmlDepth > 0 || /^\s*<div className=/.test(line)) {
         htmlDepth += (line.match(/<div/g) ?? []).length - (line.match(/<\/div>/g) ?? []).length;
         continue;
      }
      if (/^\s*That renders to:\s*$/.test(line)) continue;

      if (/^import .* from ["'].*["'];?\s*$/.test(line)) continue;
      if (/^\s*<\/?Tabs>\s*$/.test(line)) continue;
      if (/^\s*<br\s*\/>\s*$/.test(line)) continue;
      if (/^\s*!\[.*\]\(.*\)/.test(line)) continue;

      const tabItemMatch = line.match(/^\s*<TabItem\b.*label="([^"]+)".*>\s*$/);
      if (tabItemMatch) {
         isInTabItem = true;
         tabItemDedent = undefined;
         output.push(`**${tabItemMatch[1]}:**`, "");
         continue;
      }
      if (/^\s*<\/TabItem>\s*$/.test(rawLine)) {
         isInTabItem = false;
         tabItemDedent = undefined;
         continue;
      }

      const admonitionMatch = line.match(/^\s*:::(\w+)\s*(.*)$/);
      if (admonitionMatch && !isInAdmonition) {
         isInAdmonition = true;
         const title = admonitionMatch[2] || admonitionTitles[admonitionMatch[1]] || admonitionMatch[1];
         output.push(`> **${title}:**`, ">");
         continue;
      }
      if (isInAdmonition && /^\s*:::\s*$/.test(line)) {
         isInAdmonition = false;
         continue;
      }

      // The page title is added from the front matter
      if (!removedTitle && /^# /.test(line)) {
         removedTitle = true;
         continue;
      }

      line = line
         .replace(/<HighlightedText[^>]*>(.*?)<\/HighlightedText>/g, "$1")
         .replace(/<br\s*\/?>/g, "")
         .replace(/\]\(([^)\s]+)\)/g, (_, link) => `](${resolveLink(link, page)})`);

      output.push(isInAdmonition ? `> ${line.trim()}`.trimEnd() : line);
   }

   const body = output
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

   return [
      `# ${page.title}`,
      page.description ? `> ${page.description}` : undefined,
      `Source: ${siteUrl}/docs/${page.urlPath}`,
      body,
   ]
      .filter(Boolean)
      .join("\n\n");
}

function checkLlmsFile(llmsContent, pages) {
   const linkedUrls = new Set(
      [...llmsContent.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((match) => match[1].split("#")[0]),
   );
   const pageUrls = new Set(pages.map((page) => `${siteUrl}/docs/${page.urlPath}.md`));

   const warnings = [
      ...[...pageUrls].filter((url) => !linkedUrls.has(url)).map((url) => `missing link to ${url}`),
      ...[...linkedUrls]
         .filter((url) => url.startsWith(`${siteUrl}/docs/`) && !pageUrls.has(url))
         .map((url) => `link to a page that does not exist: ${url}`),
   ];

   for (const warning of warnings) console.warn(`[generate-llms] static/llms.txt - ${warning}`);
}

const pages = flattenDocsTree(readDocsTree(docsDir));
const llmsContent = fs.readFileSync(llmsFilePath, "utf8");
const aiRule = createAiRule(llmsContent);

fs.mkdirSync(path.dirname(aiRuleFilePath), { recursive: true });
fs.writeFileSync(aiRuleFilePath, `${JSON.stringify({ content: aiRule }, null, 3)}\n`);

fs.rmSync(markdownOutputDir, { recursive: true, force: true });

const markdownPages = pages.map((page) => {
   const markdown = convertMdxToMarkdown(page, aiRule);
   const outputPath = path.join(markdownOutputDir, `${page.urlPath}.md`);

   fs.mkdirSync(path.dirname(outputPath), { recursive: true });
   fs.writeFileSync(outputPath, `${markdown}\n`);

   return markdown;
});

const llmsPreamble = llmsContent.split(/\n## /)[0].trim();
fs.writeFileSync(llmsFullFilePath, `${[llmsPreamble, ...markdownPages].join("\n\n---\n\n")}\n`);

checkLlmsFile(llmsContent, pages);

console.log(`[generate-llms] Generated ${pages.length} markdown pages and llms-full.txt`);
