import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("app source contains the interview simulator surface", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const questions = await readFile(
    new URL("../app/questions.ts", import.meta.url),
    "utf8",
  );
  const layout = await readFile(
    new URL("../app/layout.tsx", import.meta.url),
    "utf8",
  );

  assert.match(layout, /Java Interview Command Center/);
  assert.match(page, /Soru Lab/);
  assert.match(page, /AI Match/);
  assert.match(page, /Mülakatı başlat/);
  assert.match(page, /Deepgram key/);
  assert.match(page, /Mikrofonla cevapla/);
  assert.match(page, /AI Soru/);
  assert.match(page, /Deepgram STT/);
  assert.match(page, /Konu matrisi/);
  assert.match(page, /Local veri/);
  assert.match(questions, /HashMap nasıl çalışır/);
  assert.match(questions, /Transactional Outbox Pattern/);
  assert.match(questions, /CRM projesinin mimarisini Java 21/);
  assert.match(questions, /SEM projesinde Java unit test/);
  assert.match(questions, /JUnit 5, Mockito, Testcontainers/);
  assert.doesNotMatch(page, /Çarşamba teknik mülakatına yoğun hazırlık/);
  assert.doesNotMatch(page, /Soruyu seslendir|Sesleniyor|TTS modeli|browser-tr-TR/);
  assert.doesNotMatch(page, /Çalışma sprinti|Mülakat profili|Hedef tarih/);
  assert.doesNotMatch(page, /target-panel|targetDiffLabel/);
});

test("project is configured for Vercel-compatible Next.js", async () => {
  const packageJson = await readFile(
    new URL("../package.json", import.meta.url),
    "utf8",
  );
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  assert.match(packageJson, /"build": "next build"/);
  assert.match(packageJson, /"dev": "next dev"/);
  assert.doesNotMatch(packageJson, /vinext|wrangler|drizzle-kit/);
  assert.match(readme, /Vercel Deploy/);
});
