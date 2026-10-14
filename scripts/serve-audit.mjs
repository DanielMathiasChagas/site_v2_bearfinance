// Servidor isolado para auditoria (Lighthouse/axe): serve uma cópia congelada do build.
// Uso: PORT=3500 node scripts/serve-audit.mjs <publicDir> [dataDir]
import { createApp } from "../server.js";
createApp({ publicDir: process.argv[2], dataDir: process.argv[3] || "/tmp/bf-audit-data", log: console }).listen(Number(process.env.PORT) || 3500, () => console.log("audit em 3500"));
