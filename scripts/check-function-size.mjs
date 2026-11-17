// Sums the files Next.js traces into the /api/chat function and compares them with
// Vercel's 250 MB (uncompressed) limit for a serverless function. Run after `npm run build`.
import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const LIMIT_MB = 250;
const trace = '.next/server/app/api/chat/route.js.nft.json';
const { files } = JSON.parse(readFileSync(trace, 'utf8'));
let bytes = 0;
for (const f of files) {
  try {
    const s = statSync(resolve(dirname(trace), f));
    if (s.isFile()) bytes += s.size;
  } catch {}
}
const mb = bytes / 1024 / 1024;
console.log(`/api/chat traced size: ${mb.toFixed(1)} MB (limit ${LIMIT_MB} MB)`);
process.exit(mb > LIMIT_MB ? 1 : 0);
