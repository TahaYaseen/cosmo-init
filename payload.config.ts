// Re-exported at the repo root per Payload 3.x convention (the Payload CLI
// and some tooling look for ./payload.config.ts at the project root).
// The real, source-of-truth config lives at src/lib/payload.config.ts
// (architecture.md §24 folder structure).
export { default } from './src/lib/payload.config';
