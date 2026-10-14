// Runner da suíte E2E: sobe o servidor na porta 3300 (se não houver um), roda `node --test tests/e2e/` e derruba o servidor.
// Uso: node tests/e2e/run.mjs [--build] [--only 05-forms.test.mjs]
// Variáveis: E2E_PORT (3300), E2E_BASE_URL, E2E_CONCURRENCY (3)
import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const PORT = Number(process.env.E2E_PORT || 3300);
const BASE = process.env.E2E_BASE_URL || `http://127.0.0.1:${PORT}`;
const args = process.argv.slice(2);

const healthy = async () => { try { return (await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(1500) })).ok; } catch { return false; } };
const run = (argv, env = {}) => new Promise((res) => { const p = spawn(process.execPath, argv, { cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env } }); p.on("exit", (c) => res(c ?? 1)); });

if (args.includes("--build")) { const c = await run(["src/build.js"]); if (c) process.exit(c); }

let child = null;
if (!(await healthy())) {
  child = spawn(process.execPath, ["server.js"], { cwd: ROOT, env: { ...process.env, PORT: String(PORT) }, stdio: ["ignore", "inherit", "inherit"] });
  const t0 = Date.now();
  while (!(await healthy())) {
    if (Date.now() - t0 > 10_000 || child.exitCode !== null) { console.error(`[e2e] servidor não subiu em ${BASE}`); process.exit(1); }
    await new Promise((r) => setTimeout(r, 200));
  }
  console.log(`[e2e] servidor iniciado em ${BASE} (pid ${child.pid})`);
} else console.log(`[e2e] usando servidor já ativo em ${BASE}`);

const only = args.indexOf("--only");
const files = only >= 0 ? [join("tests", "e2e", args[only + 1])] : ["tests/e2e/*.test.mjs"]; // glob expandido pelo próprio node --test (diretório não funciona no Node 24)
const code = await run(["--test", `--test-concurrency=${process.env.E2E_CONCURRENCY || 3}`, "--test-reporter=spec", "--test-reporter-destination=stdout", ...files], { E2E_REQUIRE: "1" });
if (child) child.kill("SIGTERM");
process.exit(code);
