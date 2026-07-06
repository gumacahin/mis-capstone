import { execSync } from "node:child_process";
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = execSync("git rev-parse --show-toplevel", {
  encoding: "utf8",
}).trim();
const hooksDir = join(repoRoot, ".git", "hooks");
const hookPath = join(hooksDir, "commit-msg");

const hookScript = `#!/usr/bin/env sh
set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
npm --prefix "$REPO_ROOT/ui" run commitlint -- --edit "$1"
`;

mkdirSync(hooksDir, { recursive: true });
writeFileSync(hookPath, hookScript, { encoding: "utf8" });
chmodSync(hookPath, 0o755);

console.log(`Installed commit-msg hook at ${hookPath}`);
