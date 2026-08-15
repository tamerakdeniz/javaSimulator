# Java Interview Command Center

Java teknik mülakat hazırlığı için local-first Next.js uygulaması.

## Özellikler

- Seviye ve konu filtresiyle Java/Spring soru bankası
- Yazılı cevap girme, beklenen cevabı görme ve yerel rubrik skoru
- Soru Lab ve mock mülakatta mikrofonla cevap transkripti
- Çoktan seçmeli test modu ve yanlışlardan tekrar havuzu
- Mock mülakat modu ve opsiyonel Deepgram STT
- Ayrı AI Soru modu ile kişisel soru üretimi
- Opsiyonel Gemini, OpenAI veya Claude API key ile AI feedback
- Tüm kullanıcı verileri ve API keyler tarayıcı localStorage alanında tutulur

## Lokal Çalıştırma

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

## Vercel Deploy

1. Bu repo GitHub'a push edilir.
2. Vercel'de **New Project** seçilir.
3. `tamerakdeniz/javaSimulator` reposu import edilir.
4. Build command: `npm run build`
5. Output directory boş bırakılır.

Harici API keyleri Vercel environment variable olarak eklemeye gerek yoktur; uygulama keyleri kullanıcı tarayıcısında saklar.

## Komutlar

```bash
npm run dev
npm run build
npm run lint
npm test
```
