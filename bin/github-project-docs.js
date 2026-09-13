#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

const ignoredDirectories = new Set([".git", "node_modules", "dist", "build"]);

function printHelp() {
  console.log(`Usage: github-project-docs --repo OWNER/REPO [options]

Generate PROJECT_DOCUMENTATION.md from a public or authenticated GitHub repository.

Options:
  --repo OWNER/REPO       Repository to document (required)
  --ref REF               Branch, tag, or commit (default: repository default branch)
  --output FILE           Markdown output path (default: PROJECT_DOCUMENTATION.md)
  --include-source        Include source excerpts for text files
  --max-source-lines N    Maximum excerpt lines per file (default: 80)
  --help                  Show this help

Examples:
  npx github-project-docs --repo octocat/Hello-World
  npm run docs -- --repo owner/project --ref main --output docs/project.md
  npm run docs -- --repo owner/project --include-source`);
}

function parseArgs(argv) {
  const options = { output: "PROJECT_DOCUMENTATION.md", maxSourceLines: 80 };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      printHelp();
      process.exit(0);
    }
    if (argument === "--include-source") {
      options.includeSource = true;
      continue;
    }
    if (!["--repo", "--ref", "--output", "--max-source-lines"].includes(argument)) {
      throw new Error(`Unknown option: ${argument}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${argument}`);
    }
    if (argument === "--repo") options.repo = value;
    if (argument === "--ref") options.ref = value;
    if (argument === "--output") options.output = value;
    if (argument === "--max-source-lines") options.maxSourceLines = Number(value);
    index += 1;
  }
  if (!options.repo) throw new Error("--repo OWNER/REPO is required");
  if (!/^[-\w.]+\/[-\w.]+$/.test(options.repo)) {
    throw new Error("--repo must be in OWNER/REPO format");
  }
  if (!Number.isInteger(options.maxSourceLines) || options.maxSourceLines < 1) {
    throw new Error("--max-source-lines must be a positive integer");
  }
  return options;
}

function ghApi(endpoint) {
  try {
    return JSON.parse(execFileSync("gh", ["api", endpoint], { encoding: "utf8" }));
  } catch (error) {
    const message = error.stderr?.toString().trim() || error.message;
    throw new Error(`GitHub API request failed for ${endpoint}: ${message}`);
  }
}

function shellText(value) {
  return String(value ?? "").replaceAll("|", "\\|").replace(/\r?\n/g, " ");
}

function languageFor(path) {
  const extension = extname(path).toLowerCase();
  const languages = {
    ".c": "C", ".cpp": "C++", ".cs": "C#", ".css": "CSS", ".gd": "GDScript",
    ".go": "Go", ".html": "HTML", ".java": "Java", ".js": "JavaScript",
    ".json": "JSON", ".jsx": "JavaScript JSX", ".md": "Markdown", ".php": "PHP",
    ".py": "Python", ".rb": "Ruby", ".rs": "Rust", ".sh": "Shell",
    ".sql": "SQL", ".swift": "Swift", ".ts": "TypeScript", ".tsx": "TypeScript JSX",
    ".toml": "TOML", ".xml": "XML", ".yaml": "YAML", ".yml": "YAML",
  };
  return languages[extension] || (basename(path).includes("Dockerfile") ? "Dockerfile" : "Other");
}

function purposeFor(path, content = "") {
  const name = basename(path).toLowerCase();
  const firstUsefulLine = content.split("\n").map((line) => line.trim()).find(Boolean) || "";
  const knownNames = {
    "readme.md": "Project introduction, setup, and usage documentation.",
    "package.json": "Node.js package metadata, scripts, and dependencies.",
    "dockerfile": "Container image build instructions.",
    ".gitignore": "Git exclusions for generated or local-only files.",
    "license": "Terms governing use and distribution of the project.",
  };
  if (knownNames[name]) return knownNames[name];
  if (/test|spec/.test(name)) return "Automated tests for project behavior.";
  if (/config|\.json$|\.ya?ml$|\.toml$/.test(name)) return "Project configuration or tool settings.";
  if (/index|main|app|server|cli/.test(name)) return "Application entry point or top-level runtime wiring.";
  if (/component|view|page|screen/.test(name)) return "User-interface component or screen.";
  if (/util|helper|common|lib/.test(name)) return "Shared utility or library code.";
  if (/^#!/.test(firstUsefulLine)) return "Executable command-line or automation script.";
  return firstUsefulLine.startsWith("//") || firstUsefulLine.startsWith("#")
    ? firstUsefulLine.replace(/^[/#\s]+/, "").slice(0, 180)
    : "Project source, asset, or supporting file; inspect the linked contents for implementation details.";
}

function readBlob(repo, sha) {
  const blob = ghApi(`repos/${repo}/git/blobs/${sha}`);
  if (blob.encoding !== "base64" || blob.size > 1_000_000) return "";
  return Buffer.from(blob.content.replaceAll("\n", ""), "base64").toString("utf8");
}

function fenceFor(language) {
  return language.toLowerCase().replace("javascript jsx", "jsx").replace("typescript jsx", "tsx").replace("c#", "csharp").replace("other", "text");
}

function createDocument(options, repository, files) {
  const lines = [
    `# ${repository.full_name} Project Documentation`,
    "",
    `Generated from [${repository.full_name}](${repository.html_url}) on ${new Date().toISOString().slice(0, 10)}.`,
    `Default branch: \`${repository.default_branch}\` | Files documented: **${files.length}**`,
    "",
    "## Repository Overview",
    "",
    repository.description || "No repository description was provided.",
    "",
    "## File Index",
    "",
    "| File | Language | Size | Purpose |",
    "| --- | --- | ---: | --- |",
  ];
  for (const file of files) {
    lines.push(`| [\`${shellText(file.path)}\`](${repository.html_url}/blob/${encodeURIComponent(options.ref || repository.default_branch)}/${file.path}) | ${file.language} | ${file.size.toLocaleString()} bytes | ${shellText(file.purpose)} |`);
  }
  for (const file of files) {
    lines.push("", `## ${file.path}`, "", `- **Language:** ${file.language}`, `- **Size:** ${file.size.toLocaleString()} bytes`, `- **Purpose:** ${file.purpose}`, `- **GitHub:** [View file](${repository.html_url}/blob/${encodeURIComponent(options.ref || repository.default_branch)}/${file.path})`);
    if (options.includeSource && file.content) {
      const excerpt = file.content.split("\n").slice(0, options.maxSourceLines).join("\n");
      lines.push("", "### Source Excerpt", "", `~~~${fenceFor(file.language)}`, excerpt, "~~~");
      if (file.content.split("\n").length > options.maxSourceLines) lines.push("", `Excerpt limited to ${options.maxSourceLines} lines; use the GitHub link for the complete file.`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const repository = ghApi(`repos/${options.repo}`);
  const tree = ghApi(`repos/${options.repo}/git/trees/${encodeURIComponent(options.ref || repository.default_branch)}?recursive=1`);
  if (tree.truncated) throw new Error("GitHub returned a truncated file tree; documentation would be incomplete. Use a narrower ref or generate docs from a local checkout.");
  const files = tree.tree.filter((entry) => entry.type === "blob" && !entry.path.split("/").some((part) => ignoredDirectories.has(part))).map((entry) => {
    const content = options.includeSource || entry.path.toLowerCase().endsWith(".md") ? readBlob(options.repo, entry.sha) : "";
    return { ...entry, content, language: languageFor(entry.path), purpose: purposeFor(entry.path, content), size: entry.size || Buffer.byteLength(content) };
  });
  const output = resolve(process.cwd(), options.output);
  writeFileSync(output, createDocument(options, repository, files), "utf8");
  console.log(`Wrote ${files.length} file entries to ${output}`);
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  console.error("Run with --help for usage.");
  process.exitCode = 1;
}