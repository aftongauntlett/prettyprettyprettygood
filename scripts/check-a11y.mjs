import { rmSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const cliArgs = process.argv.slice(2);
const url = cliArgs[0] ?? "http://127.0.0.1:4321/";
const extraLighthouseArgs = cliArgs.slice(1);
const outputPath = `.tmp-lighthouse-a11y-${process.pid}.json`;

const lighthouseArgs = [
  "--yes",
  "lighthouse",
  url,
  "--only-categories=accessibility",
  "--quiet",
  "--chrome-flags=--headless=new",
  ...extraLighthouseArgs,
  "--output=json",
  `--output-path=${outputPath}`,
];

const run = spawnSync("npx", lighthouseArgs, {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (run.status !== 0) {
  process.exit(run.status ?? 1);
}

const report = JSON.parse(readFileSync(outputPath, "utf8"));
const score = report.categories?.accessibility?.score ?? 0;

const failingAudits = Object.values(report.audits ?? {}).filter(
  (audit) => audit?.scoreDisplayMode === "binary" && audit?.score === 0,
);

console.log(`Accessibility score: ${Math.round(score * 100)}`);

if (failingAudits.length > 0) {
  console.error("Failing binary accessibility audits:");
  for (const audit of failingAudits) {
    console.error(`- ${audit.id}: ${audit.title}`);
  }

  rmSync(outputPath, { force: true });
  process.exit(1);
}

rmSync(outputPath, { force: true });
console.log("No failing binary accessibility audits found.");
