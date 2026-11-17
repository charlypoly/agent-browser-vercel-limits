# Task Agent

A chat agent built with Next.js (App Router) and the Vercel AI SDK. The agent runs
server-side in `src/app/api/chat/route.ts` and can call tools defined in
`src/lib/tools/`.

## Getting started

```bash
npm install
cp .env.example .env.local   # add your AI Gateway key
npm run dev
```

Open http://localhost:3000.

## Project layout

- `src/lib/agent.ts`: model, system prompt and agent loop (`streamText` with tools)
- `src/lib/tools/browser.ts`: browser tools (`browserOpen`, `browserAct`)
- `src/lib/browser/session.ts`: launches Chromium for each tool call (bundled Playwright Chromium on Vercel, falling back to `@sparticuz/chromium`)
- `scripts/check-function-size.mjs`: `npm run check:size` after a build reports the `/api/chat` function size
- `src/app/api/chat/route.ts`: streaming chat endpoint
- `src/app/page.tsx`: chat UI (`useChat`)

## Deploy

The app is deployed on Vercel. Push to `main` to deploy; set `AI_GATEWAY_API_KEY`
(or use the Vercel AI Gateway OIDC token) in the project settings.

## Known issues

Production deploys started failing after we bundled Chromium:

```
Error: The Serverless Function "api/chat" is 776.2 MB which exceeds the maximum size limit of 250 MB.
```

Before that, browser tasks on long pages regularly hit the function limit:

```
Task timed out after 60.00 seconds
```
