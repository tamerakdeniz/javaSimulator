"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_MODELS,
  DEFAULT_NOTES,
  QUESTION_BANK,
  type AiProvider,
  type LevelFilter,
  type Question,
  type SpeechProvider,
} from "./questions";

type Mode = "study" | "quiz" | "retry" | "interview" | "generate" | "settings";

type Profile = {
  levelFilter: LevelFilter;
  categoryFilter: string;
  provider: AiProvider;
  model: string;
  apiKey: string;
  speechProvider: SpeechProvider;
  deepgramKey: string;
  deepgramSttModel: string;
};

type QuizStats = {
  total: number;
  correct: number;
  wrongIds: string[];
  lastAnswers: Record<string, number>;
};

type InterviewTurn = {
  id: string;
  questionId: string;
  question: string;
  answer: string;
  feedback: string;
  score: number;
  createdAt: string;
};

type Progress = {
  answers: Record<string, string>;
  aiFeedback: Record<string, string>;
  completedIds: string[];
  repeatIds: string[];
  customQuestions: Question[];
  activeInterviewQuestionId: string;
  interviewRunning: boolean;
  interviewTurns: InterviewTurn[];
  quiz: QuizStats;
  profile: Profile;
};

type Coverage = {
  score: number;
  hits: string[];
  missing: string[];
};

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

type OpenAiResponse = {
  output_text?: string;
  output?: Array<{ content?: Array<{ text?: string }> }>;
};

type AnthropicResponse = {
  content?: Array<{ text?: string }>;
};

type DeepgramListenResponse = {
  results?: {
    channels?: Array<{
      alternatives?: Array<{ transcript?: string }>;
    }>;
  };
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
};

type VoiceTarget =
  | { kind: "study"; questionId: string }
  | { kind: "interview" };

const STORAGE_KEY = "java-interview-command-center-v1";
const DEEPGRAM_DEFAULT_STT_MODEL = "nova-2";

const MODES: Array<{ id: Mode; label: string }> = [
  { id: "study", label: "Soru Lab" },
  { id: "quiz", label: "Test" },
  { id: "retry", label: "Tekrar" },
  { id: "interview", label: "Mülakat" },
  { id: "generate", label: "AI Soru" },
  { id: "settings", label: "Ayarlar" },
];

function createInitialProfile(): Profile {
  return {
    levelFilter: "ALL",
    categoryFilter: "ALL",
    provider: "local",
    model: DEFAULT_MODELS.local,
    apiKey: "",
    speechProvider: "browser",
    deepgramKey: "",
    deepgramSttModel: DEEPGRAM_DEFAULT_STT_MODEL,
  };
}

function createInitialProgress(): Progress {
  return {
    answers: {},
    aiFeedback: {},
    completedIds: [],
    repeatIds: [],
    customQuestions: [],
    activeInterviewQuestionId: QUESTION_BANK[0].id,
    interviewRunning: false,
    interviewTurns: [],
    quiz: {
      total: 0,
      correct: 0,
      wrongIds: [],
      lastAnswers: {},
    },
    profile: createInitialProfile(),
  };
}

function mergeProgress(raw: string | null): Progress {
  const initial = createInitialProgress();
  if (!raw) return initial;

  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const profile = normalizeProfile({
      ...initial.profile,
      ...(parsed.profile ?? {}),
    });

    return {
      ...initial,
      ...parsed,
      answers: { ...initial.answers, ...(parsed.answers ?? {}) },
      aiFeedback: { ...initial.aiFeedback, ...(parsed.aiFeedback ?? {}) },
      completedIds: parsed.completedIds ?? initial.completedIds,
      repeatIds: parsed.repeatIds ?? initial.repeatIds,
      customQuestions: parsed.customQuestions ?? initial.customQuestions,
      interviewTurns: parsed.interviewTurns ?? initial.interviewTurns,
      quiz: {
        ...initial.quiz,
        ...(parsed.quiz ?? {}),
        lastAnswers: {
          ...initial.quiz.lastAnswers,
          ...(parsed.quiz?.lastAnswers ?? {}),
        },
      },
      profile,
    };
  } catch {
    return initial;
  }
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function addUnique(values: string[], value: string) {
  return values.includes(value) ? values : [...values, value];
}

function removeValue(values: string[], value: string) {
  return values.filter((item) => item !== value);
}

function normalizeProfile(
  profile: Profile & {
    deepgramTtsModel?: string;
    notes?: string;
    targetDate?: string;
  },
): Profile {
  const normalized = { ...profile };
  delete normalized.deepgramTtsModel;
  delete normalized.notes;
  delete normalized.targetDate;

  return {
    ...normalized,
    deepgramSttModel:
      normalized.deepgramSttModel.trim() || DEEPGRAM_DEFAULT_STT_MODEL,
  };
}

function calculateCoverage(question: Question, answer: string): Coverage {
  const normalizedAnswer = normalize(answer);
  const hits = question.keywords.filter((keyword) =>
    normalizedAnswer.includes(normalize(keyword)),
  );
  const missing = question.keywords.filter((keyword) => !hits.includes(keyword));
  const lengthBonus = Math.min(25, Math.floor(normalizedAnswer.length / 28));
  const keywordScore = Math.round((hits.length / question.keywords.length) * 70);
  const score = Math.min(95, Math.max(5, keywordScore + lengthBonus));
  return { score, hits, missing };
}

function localFeedback(question: Question, answer: string) {
  if (!answer.trim()) {
    return "Yerel rubrik: Henüz cevap yok. Önce 5-7 cümlelik aday cevabı yaz, sonra ideal cevapla kavram eşleşmesini kontrol et.";
  }

  const coverage = calculateCoverage(question, answer);
  const hitText = coverage.hits.length
    ? coverage.hits.join(", ")
    : "Henüz net kavram yakalanmadı";
  const missingText = coverage.missing.length
    ? coverage.missing.slice(0, 6).join(", ")
    : "Ana kavramların çoğu var";

  return [
    `Yerel rubrik skoru: ${coverage.score}/100`,
    `Güçlü eşleşmeler: ${hitText}.`,
    `Eksik kalabilecek başlıklar: ${missingText}.`,
    "Cevabı kısa tanım, proje örneği, risk/trade-off ve test/debug yaklaşımı sırasıyla toparla.",
  ].join("\n");
}

function buildFeedbackPrompt(question: Question, answer: string) {
  return [
    "Sen 10 yıllık Java/Spring teknik mülakat koçusun.",
    "Aday junior veya junior-mid Java developer pozisyonuna hazırlanıyor.",
    "Cevabı Türkçe değerlendir. Gereksiz övgü verme, teknik ve net ol.",
    "Format: Skor /100, Güçlü Noktalar, Eksikler, Daha İyi Cevap, Muhtemel Takip Sorusu.",
    "",
    `Mülakat notları:\n${DEFAULT_NOTES}`,
    "",
    `Soru: ${question.prompt}`,
    `Beklenen cevap: ${question.answer}`,
    `Aday cevabı: ${answer || "Cevap yazılmadı."}`,
  ].join("\n");
}

function buildQuestionPrompt(profile: Profile, existingPrompts: string[]) {
  return [
    "Junior Java Developer teknik mülakatı için tek bir yeni soru üret.",
    `Hedef seviye: ${profile.levelFilter === "ALL" ? "JR-MID karma" : profile.levelFilter}`,
    "Soru CRM proje stack'i, SEM staj unit testleri, Spring Boot, Java Core, SQL, Security, microservice, observability veya DevOps notlarından birine dokunsun.",
    "Cevap verme. Sadece soruyu yaz.",
    "",
    `Aday notları:\n${DEFAULT_NOTES}`,
    "",
    `Daha önce sorulanlardan kaçın:\n${existingPrompts.slice(0, 12).join("\n")}`,
  ].join("\n");
}

async function callAiProvider(profile: Profile, prompt: string) {
  if (profile.provider === "local" || !profile.apiKey.trim()) {
    throw new Error("AI provider ayarlı değil.");
  }

  if (profile.provider === "gemini") {
    const model = encodeURIComponent(profile.model || DEFAULT_MODELS.gemini);
    const key = encodeURIComponent(profile.apiKey.trim());
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.25 },
        }),
      },
    );
    if (!response.ok) throw new Error(await response.text());
    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n");
    if (!text) throw new Error("Gemini boş cevap döndürdü.");
    return text;
  }

  if (profile.provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${profile.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: profile.model || DEFAULT_MODELS.openai,
        input: prompt,
        temperature: 0.25,
      }),
    });
    if (!response.ok) throw new Error(await response.text());
    const data = (await response.json()) as OpenAiResponse;
    const nestedText = data.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter(Boolean)
      .join("\n");
    const text = data.output_text || nestedText;
    if (!text) throw new Error("OpenAI boş cevap döndürdü.");
    return text;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": profile.apiKey.trim(),
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: profile.model || DEFAULT_MODELS.claude,
      max_tokens: 900,
      temperature: 0.25,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  const data = (await response.json()) as AnthropicResponse;
  const text = data.content
    ?.map((content) => content.text)
    .filter(Boolean)
    .join("\n");
  if (!text) throw new Error("Claude boş cevap döndürdü.");
  return text;
}

async function transcribeWithDeepgram(blob: Blob, profile: Profile) {
  const params = new URLSearchParams({
    model: profile.deepgramSttModel || DEEPGRAM_DEFAULT_STT_MODEL,
    language: "tr",
    punctuate: "true",
    smart_format: "true",
  });
  const response = await fetch(`https://api.deepgram.com/v1/listen?${params}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${profile.deepgramKey.trim()}`,
      "Content-Type": blob.type || "audio/webm",
    },
    body: blob,
  });
  if (!response.ok) throw new Error(await response.text());
  const data = (await response.json()) as DeepgramListenResponse;
  const transcript =
    data.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim();
  if (!transcript) throw new Error("Deepgram transcript boş döndü.");
  return transcript;
}

function scoreLabel(score: number) {
  if (score >= 78) return "güçlü";
  if (score >= 55) return "yakın";
  return "tekrar";
}

export default function Home() {
  const [progress, setProgress] = useState<Progress>(() => createInitialProgress());
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>("study");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(QUESTION_BANK[0].id);
  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTarget, setRecordingTarget] = useState<VoiceTarget | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const savedProgress = mergeProgress(
      window.localStorage.getItem(STORAGE_KEY),
    );
    document.cookie =
      "javaInterviewLab=local-browser-state; Max-Age=31536000; SameSite=Lax; path=/";
    window.queueMicrotask(() => {
      setProgress(savedProgress);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [hydrated, progress]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const questions = useMemo(
    () => [...QUESTION_BANK, ...progress.customQuestions],
    [progress.customQuestions],
  );

  const categories = useMemo(
    () => ["ALL", ...unique(questions.map((question) => question.category)).sort()],
    [questions],
  );

  const filteredQuestions = useMemo(() => {
    const term = normalize(query);
    return questions.filter((question) => {
      const profile = progress.profile;
      const levelMatch =
        profile.levelFilter === "ALL" || question.level === profile.levelFilter;
      const categoryMatch =
        profile.categoryFilter === "ALL" ||
        question.category === profile.categoryFilter;
      const textMatch =
        !term ||
        normalize(
          [
            question.prompt,
            question.answer,
            question.category,
            question.level,
            ...question.tags,
            ...question.keywords,
          ].join(" "),
        ).includes(term);
      return levelMatch && categoryMatch && textMatch;
    });
  }, [progress.profile, query, questions]);

  const selectedQuestion =
    questions.find((question) => question.id === selectedId) ??
    filteredQuestions[0] ??
    questions[0];
  const selectedAnswer = progress.answers[selectedQuestion.id] ?? "";
  const selectedCoverage = calculateCoverage(selectedQuestion, selectedAnswer);
  const selectedAnswerVisible = visibleAnswers[selectedQuestion.id] ?? false;

  const quizPool = useMemo(
    () => filteredQuestions.filter((question) => Boolean(question.mcq)),
    [filteredQuestions],
  );
  const quizQuestion = quizPool.length
    ? quizPool[quizIndex % quizPool.length]
    : undefined;
  const quizMcq = quizQuestion?.mcq;

  const retryIds = unique([...progress.repeatIds, ...progress.quiz.wrongIds]);
  const retryQuestions = retryIds
    .map((id) => questions.find((question) => question.id === id))
    .filter((question): question is Question => Boolean(question));
  const completedCount = progress.completedIds.length;
  const answeredCount = Object.values(progress.answers).filter((value) =>
    value.trim(),
  ).length;
  const completionRate = Math.round((completedCount / questions.length) * 100);
  const activeInterviewQuestion =
    questions.find(
      (question) => question.id === progress.activeInterviewQuestionId,
    ) ?? filteredQuestions[0] ?? questions[0];

  const categoryStats = categories
    .filter((category) => category !== "ALL")
    .map((category) => {
      const total = questions.filter((question) => question.category === category)
        .length;
      const done = questions.filter(
        (question) =>
          question.category === category &&
          progress.completedIds.includes(question.id),
      ).length;
      return { category, total, done };
    });
  const studyVoiceTarget: VoiceTarget = {
    kind: "study",
    questionId: selectedQuestion.id,
  };
  const interviewVoiceTarget: VoiceTarget = { kind: "interview" };

  function updateProfile(patch: Partial<Profile>) {
    setProgress((current) => ({
      ...current,
      profile: { ...current.profile, ...patch },
    }));
  }

  function resetQuizUi() {
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
  }

  function setAnswer(questionId: string, value: string) {
    setProgress((current) => ({
      ...current,
      answers: { ...current.answers, [questionId]: value },
    }));
  }

  function toggleRepeat(questionId: string) {
    setProgress((current) => ({
      ...current,
      repeatIds: current.repeatIds.includes(questionId)
        ? removeValue(current.repeatIds, questionId)
        : [...current.repeatIds, questionId],
    }));
  }

  function markCompleted(questionId: string) {
    setProgress((current) => ({
      ...current,
      completedIds: addUnique(current.completedIds, questionId),
    }));
    setToast("Soru tamamlandı olarak işaretlendi.");
  }

  async function requestAiFeedback(question: Question, answer: string) {
    const local = localFeedback(question, answer);
    if (progress.profile.provider === "local" || !progress.profile.apiKey.trim()) {
      setProgress((current) => ({
        ...current,
        aiFeedback: { ...current.aiFeedback, [question.id]: local },
      }));
      setToast("Yerel rubrik kullanıldı.");
      return local;
    }

    setAiLoading(question.id);
    try {
      const prompt = buildFeedbackPrompt(question, answer);
      const feedback = await callAiProvider(progress.profile, prompt);
      setProgress((current) => ({
        ...current,
        aiFeedback: { ...current.aiFeedback, [question.id]: feedback },
      }));
      setToast("AI feedback alındı.");
      return feedback;
    } catch {
      setProgress((current) => ({
        ...current,
        aiFeedback: { ...current.aiFeedback, [question.id]: local },
      }));
      setToast("AI çağrısı başarısız oldu; yerel rubrik yazıldı.");
      return local;
    } finally {
      setAiLoading(null);
    }
  }

  function submitQuizAnswer() {
    if (!quizQuestion?.mcq || selectedOption === null) return;
    const isCorrect = selectedOption === quizQuestion.mcq.correctIndex;
    setProgress((current) => ({
      ...current,
      repeatIds: isCorrect
        ? current.repeatIds
        : addUnique(current.repeatIds, quizQuestion.id),
      quiz: {
        total: current.quiz.total + 1,
        correct: current.quiz.correct + (isCorrect ? 1 : 0),
        wrongIds: isCorrect
          ? current.quiz.wrongIds
          : addUnique(current.quiz.wrongIds, quizQuestion.id),
        lastAnswers: {
          ...current.quiz.lastAnswers,
          [quizQuestion.id]: selectedOption,
        },
      },
    }));
    setQuizSubmitted(true);
  }

  function nextQuizQuestion() {
    if (!quizPool.length) return;
    setQuizIndex((current) => (current + 1) % quizPool.length);
    setSelectedOption(null);
    setQuizSubmitted(false);
  }

  function pickNextInterviewQuestion(excludeId?: string) {
    const used = new Set(progress.interviewTurns.map((turn) => turn.questionId));
    const pool = filteredQuestions.filter(
      (question) => question.id !== excludeId && !used.has(question.id),
    );
    return pool[0] ?? filteredQuestions[0] ?? questions[0];
  }

  function isSameVoiceTarget(target: VoiceTarget) {
    if (!recordingTarget) return false;
    if (recordingTarget.kind !== target.kind) return false;
    if (target.kind === "interview") return true;
    return (
      recordingTarget.kind === "study" &&
      recordingTarget.questionId === target.questionId
    );
  }

  function appendTranscript(target: VoiceTarget, transcript: string) {
    const cleaned = transcript.trim();
    if (!cleaned) return;

    if (target.kind === "study") {
      setProgress((current) => ({
        ...current,
        answers: {
          ...current.answers,
          [target.questionId]: [current.answers[target.questionId], cleaned]
            .filter(Boolean)
            .join(" "),
        },
      }));
      return;
    }

    setInterviewAnswer((current) =>
      [current, cleaned].filter(Boolean).join(" "),
    );
  }

  function recordingLabel(target: VoiceTarget) {
    if (isTranscribing && isSameVoiceTarget(target)) return "Transcript...";
    if (isRecording && isSameVoiceTarget(target)) return "Kaydı durdur";
    return target.kind === "study" ? "Mikrofonla cevapla" : "Mikrofon";
  }

  function startBrowserRecognition(target: VoiceTarget) {
    const browserWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition =
      browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setToast("Tarayıcı speech-to-text desteklemiyor; cevabı yazarak gir.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "tr-TR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      appendTranscript(target, transcript);
    };
    recognition.onerror = () => {
      setToast("Ses tanıma başarısız oldu.");
      setIsRecording(false);
      setRecordingTarget(null);
    };
    recognition.onend = () => {
      setIsRecording(false);
      setRecordingTarget(null);
    };
    recognitionRef.current = recognition;
    setRecordingTarget(target);
    setIsRecording(true);
    recognition.start();
  }

  async function startDeepgramRecording(target: VoiceTarget) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);
        try {
          const blob = new Blob(chunksRef.current, {
            type: recorder.mimeType || "audio/webm",
          });
          const transcript = await transcribeWithDeepgram(blob, progress.profile);
          appendTranscript(target, transcript);
        } catch {
          setToast("Deepgram transcript alınamadı; cevabı yazarak tamamla.");
        } finally {
          stream.getTracks().forEach((track) => track.stop());
          setIsTranscribing(false);
          setRecordingTarget(null);
          mediaRecorderRef.current = null;
        }
      };
      mediaRecorderRef.current = recorder;
      setRecordingTarget(target);
      setIsRecording(true);
      recorder.start();
    } catch {
      setToast("Mikrofon izni alınamadı.");
    }
  }

  function toggleRecording(target: VoiceTarget) {
    if (isRecording) {
      if (!isSameVoiceTarget(target)) {
        setToast("Önce aktif ses kaydını durdur.");
        return;
      }
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      setRecordingTarget(null);
      return;
    }

    if (
      progress.profile.speechProvider === "deepgram" &&
      progress.profile.deepgramKey.trim()
    ) {
      void startDeepgramRecording(target);
      return;
    }
    startBrowserRecognition(target);
  }

  function startInterview() {
    const first = pickNextInterviewQuestion();
    setProgress((current) => ({
      ...current,
      activeInterviewQuestionId: first.id,
      interviewRunning: true,
    }));
    setInterviewAnswer("");
    setMode("interview");
  }

  async function submitInterviewAnswer() {
    if (!interviewAnswer.trim()) {
      setToast("Önce cevap gir.");
      return;
    }

    const question = activeInterviewQuestion;
    const coverage = calculateCoverage(question, interviewAnswer);
    const feedback = await requestAiFeedback(question, interviewAnswer);
    const next = pickNextInterviewQuestion(question.id);
    const turn: InterviewTurn = {
      id: `turn-${Date.now()}`,
      questionId: question.id,
      question: question.prompt,
      answer: interviewAnswer,
      feedback,
      score: coverage.score,
      createdAt: new Date().toISOString(),
    };

    setProgress((current) => ({
      ...current,
      answers: { ...current.answers, [question.id]: interviewAnswer },
      completedIds: addUnique(current.completedIds, question.id),
      repeatIds:
        coverage.score < 65
          ? addUnique(current.repeatIds, question.id)
          : current.repeatIds,
      activeInterviewQuestionId: next.id,
      interviewRunning: true,
      interviewTurns: [turn, ...current.interviewTurns].slice(0, 30),
    }));
    setInterviewAnswer("");
  }

  async function generateAiQuestion() {
    if (progress.profile.provider === "local" || !progress.profile.apiKey.trim()) {
      setToast("AI soru üretimi için ayarlardan provider ve key seç.");
      return;
    }

    setAiLoading("generate-question");
    try {
      const prompt = buildQuestionPrompt(
        progress.profile,
        questions.map((question) => question.prompt),
      );
      const generated = await callAiProvider(progress.profile, prompt);
      const questionText = generated.replace(/^["'\s]+|["'\s]+$/g, "");
      const customQuestion: Question = {
        id: `ai-${Date.now()}`,
        level:
          progress.profile.levelFilter === "ALL"
            ? "JR-MID"
            : progress.profile.levelFilter,
        category: "AI Generated",
        prompt: questionText,
        answer:
          "Bu soru AI tarafından üretildi. Cevabını AI Match ile değerlendir; yerel rubrik genel kavram, örnek, trade-off ve test/debug yapısını arar.",
        keywords: ["tanım", "örnek", "trade off", "test", "debug", "spring"],
        tags: ["AI", "Mock Interview"],
      };
      setProgress((current) => ({
        ...current,
        customQuestions: [customQuestion, ...current.customQuestions].slice(0, 15),
      }));
      setSelectedId(customQuestion.id);
      setToast("AI sorusu Soru Lab'a eklendi.");
    } catch {
      setToast("AI soru üretimi başarısız oldu.");
    } finally {
      setAiLoading(null);
    }
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "java-interview-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function resetProgress() {
    const fresh = createInitialProgress();
    setProgress(fresh);
    setSelectedId(QUESTION_BANK[0].id);
    setInterviewAnswer("");
    setVisibleAnswers({});
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    setToast("Local çalışma verisi sıfırlandı.");
  }

  return (
    <main className="app-shell">
      <section className="brand-strip">
        <p className="eyebrow">Java Interview Command Center</p>
      </section>

      <section className="metrics-grid" aria-label="Çalışma özeti">
        <div className="metric">
          <span>Soru bankası</span>
          <strong>{questions.length}</strong>
        </div>
        <div className="metric">
          <span>Cevap yazıldı</span>
          <strong>{answeredCount}</strong>
        </div>
        <div className="metric">
          <span>Tamamlanan</span>
          <strong>{completedCount}</strong>
        </div>
        <div className="metric danger">
          <span>Tekrar havuzu</span>
          <strong>{retryQuestions.length}</strong>
        </div>
        <div className="metric">
          <span>Quiz isabeti</span>
          <strong>
            {progress.quiz.total
              ? `${Math.round((progress.quiz.correct / progress.quiz.total) * 100)}%`
              : "0%"}
          </strong>
        </div>
      </section>

      <section className="control-strip">
        <div className="mode-tabs" role="tablist" aria-label="Çalışma modu">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={mode === item.id ? "active" : ""}
              onClick={() => setMode(item.id)}
              aria-pressed={mode === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="filters">
          <select
            value={progress.profile.levelFilter}
            onChange={(event) => {
              updateProfile({ levelFilter: event.target.value as LevelFilter });
              resetQuizUi();
            }}
            aria-label="Seviye filtresi"
          >
            <option value="ALL">Tüm seviyeler</option>
            <option value="JR">JR</option>
            <option value="JR-MID">JR-MID</option>
            <option value="MID">MID</option>
            <option value="SR">SR</option>
          </select>
          <select
            value={progress.profile.categoryFilter}
            onChange={(event) => {
              updateProfile({ categoryFilter: event.target.value });
              resetQuizUi();
            }}
            aria-label="Konu filtresi"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "ALL" ? "Tüm konular" : category}
              </option>
            ))}
          </select>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetQuizUi();
            }}
            placeholder="HashMap, Keycloak, Outbox..."
            aria-label="Soru ara"
          />
        </div>
      </section>

      {mode === "study" && (
        <section className="workspace-grid">
          <aside className="question-rail" aria-label="Soru listesi">
            <div className="rail-header">
              <strong>{filteredQuestions.length} soru</strong>
              <span>{completionRate}% tamam</span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${completionRate}%` }} />
            </div>
            <div className="question-list">
              {filteredQuestions.map((question) => {
                const isActive = question.id === selectedQuestion.id;
                const isRepeat = retryIds.includes(question.id);
                const isDone = progress.completedIds.includes(question.id);
                return (
                  <button
                    key={question.id}
                    type="button"
                    className={`question-row ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedId(question.id)}
                  >
                    <span>
                      {question.level} · {question.category}
                    </span>
                    <strong>{question.prompt}</strong>
                    <small>
                      {isDone ? "tamam" : "açık"} {isRepeat ? " · tekrar" : ""}
                    </small>
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="practice-panel">
            <div className="question-meta">
              <span>{selectedQuestion.level}</span>
              <span>{selectedQuestion.category}</span>
              {selectedQuestion.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <h2>{selectedQuestion.prompt}</h2>
            <textarea
              value={selectedAnswer}
              onChange={(event) => setAnswer(selectedQuestion.id, event.target.value)}
              placeholder="Kendi cevabını teknik ama konuşulur şekilde yaz..."
              rows={9}
            />
            <div className="action-row">
              <button
                type="button"
                onClick={() => toggleRecording(studyVoiceTarget)}
                className={isSameVoiceTarget(studyVoiceTarget) ? "danger-button" : ""}
                disabled={
                  isTranscribing ||
                  (isRecording && !isSameVoiceTarget(studyVoiceTarget))
                }
              >
                {recordingLabel(studyVoiceTarget)}
              </button>
              <button
                type="button"
                onClick={() =>
                  setVisibleAnswers((current) => ({
                    ...current,
                    [selectedQuestion.id]: !selectedAnswerVisible,
                  }))
                }
              >
                {selectedAnswerVisible ? "Cevabı gizle" : "Cevabı gör"}
              </button>
              <button
                type="button"
                onClick={() =>
                  void requestAiFeedback(selectedQuestion, selectedAnswer)
                }
                disabled={aiLoading === selectedQuestion.id}
              >
                {aiLoading === selectedQuestion.id ? "Analiz..." : "AI Match"}
              </button>
              <button
                type="button"
                className={
                  progress.repeatIds.includes(selectedQuestion.id) ? "warn" : ""
                }
                onClick={() => toggleRepeat(selectedQuestion.id)}
              >
                {progress.repeatIds.includes(selectedQuestion.id)
                  ? "Tekrardan çıkar"
                  : "Tekrara ekle"}
              </button>
              <button
                type="button"
                className="primary"
                onClick={() => markCompleted(selectedQuestion.id)}
              >
                Tamamlandı
              </button>
            </div>

            <div className="comparison-grid">
              <section>
                <div className="section-title">
                  <span>Kapsam</span>
                  <strong>
                    {selectedCoverage.score}/100 ·{" "}
                    {scoreLabel(selectedCoverage.score)}
                  </strong>
                </div>
                <div className="keyword-grid">
                  {selectedQuestion.keywords.map((keyword) => {
                    const hit = selectedCoverage.hits.includes(keyword);
                    return (
                      <span key={keyword} className={hit ? "hit" : "miss"}>
                        {keyword}
                      </span>
                    );
                  })}
                </div>
              </section>

              <section>
                <div className="section-title">
                  <span>AI / Yerel feedback</span>
                </div>
                <pre className="feedback-box">
                  {progress.aiFeedback[selectedQuestion.id] ??
                    "AI Match çalıştırıldığında veya provider yoksa yerel rubrik burada görünecek."}
                </pre>
              </section>
            </div>

            {selectedAnswerVisible && (
              <section className="answer-panel">
                <div className="section-title">
                  <span>Beklenen cevap</span>
                </div>
                <p>{selectedQuestion.answer}</p>
                {selectedQuestion.followUps?.length ? (
                  <div className="followups">
                    {selectedQuestion.followUps.map((followUp) => (
                      <span key={followUp}>{followUp}</span>
                    ))}
                  </div>
                ) : null}
              </section>
            )}
          </article>

          <aside className="side-panel" aria-label="Çalışma planı">
            <div className="section-title">
              <span>Konu matrisi</span>
            </div>
            <div className="category-matrix">
              {categoryStats.map((item) => (
                <div key={item.category}>
                  <span>{item.category}</span>
                  <strong>
                    {item.done}/{item.total}
                  </strong>
                </div>
              ))}
            </div>
          </aside>
        </section>
      )}

      {mode === "quiz" && (
        <section className="solo-panel">
          <div className="section-title">
            <span>Çoktan seçmeli pratik</span>
            <strong>
              {quizPool.length
                ? `${(quizIndex % quizPool.length) + 1}/${quizPool.length}`
                : "0/0"}
            </strong>
          </div>

          {quizQuestion && quizMcq ? (
            <>
              <div className="quiz-question">
                <span>
                  {quizQuestion.level} · {quizQuestion.category}
                </span>
                <h2>{quizQuestion.prompt}</h2>
              </div>
              <div className="option-grid">
                {quizMcq.options.map((option, index) => {
                  const isCorrect = index === quizMcq.correctIndex;
                  const isPicked = selectedOption === index;
                  const revealed = quizSubmitted;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={[
                        "option",
                        isPicked ? "picked" : "",
                        revealed && isCorrect ? "correct" : "",
                        revealed && isPicked && !isCorrect ? "wrong" : "",
                      ].join(" ")}
                      onClick={() => !quizSubmitted && setSelectedOption(index)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {option}
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && (
                <div className="answer-panel">
                  <div className="section-title">
                    <span>Açıklama</span>
                  </div>
                  <p>{quizMcq.explanation}</p>
                </div>
              )}
              <div className="action-row">
                <button
                  type="button"
                  className="primary"
                  onClick={submitQuizAnswer}
                  disabled={selectedOption === null || quizSubmitted}
                >
                  Cevabı kilitle
                </button>
                <button type="button" onClick={nextQuizQuestion}>
                  Sıradaki soru
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("study");
                    setSelectedId(quizQuestion.id);
                  }}
                >
                  Yazılı çalış
                </button>
              </div>
            </>
          ) : (
            <p className="empty-state">
              Bu filtrede çoktan seçmeli soru yok. Seviye veya konu filtresini
              genişlet.
            </p>
          )}
        </section>
      )}

      {mode === "retry" && (
        <section className="solo-panel">
          <div className="section-title">
            <span>Tekrar havuzu</span>
            <strong>{retryQuestions.length} soru</strong>
          </div>
          {retryQuestions.length ? (
            <div className="retry-grid">
              {retryQuestions.map((question) => (
                <button
                  key={question.id}
                  type="button"
                  className="retry-item"
                  onClick={() => {
                    setMode("study");
                    setSelectedId(question.id);
                  }}
                >
                  <span>
                    {question.level} · {question.category}
                  </span>
                  <strong>{question.prompt}</strong>
                  <small>
                    {progress.quiz.wrongIds.includes(question.id)
                      ? "quiz yanlışı"
                      : "manuel tekrar"}
                  </small>
                </button>
              ))}
            </div>
          ) : (
            <p className="empty-state">Şu an tekrar havuzu boş.</p>
          )}
          <div className="action-row">
            <button
              type="button"
              onClick={() =>
                setProgress((current) => ({
                  ...current,
                  repeatIds: [],
                  quiz: { ...current.quiz, wrongIds: [] },
                }))
              }
            >
              Havuzu temizle
            </button>
          </div>
        </section>
      )}

      {mode === "generate" && (
        <section className="solo-panel">
          <div className="section-title">
            <span>AI soru üret</span>
            <strong>{progress.customQuestions.length}/15</strong>
          </div>
          <div className="action-row">
            <button
              type="button"
              className="primary"
              onClick={generateAiQuestion}
              disabled={aiLoading === "generate-question"}
            >
              {aiLoading === "generate-question" ? "Üretiliyor..." : "Yeni soru üret"}
            </button>
            <button type="button" onClick={() => setMode("settings")}>
              AI ayarları
            </button>
          </div>
          {progress.customQuestions.length ? (
            <div className="retry-grid">
              {progress.customQuestions.map((question) => (
                <button
                  key={question.id}
                  type="button"
                  className="retry-item"
                  onClick={() => {
                    setSelectedId(question.id);
                    setMode("study");
                  }}
                >
                  <span>
                    {question.level} · {question.category}
                  </span>
                  <strong>{question.prompt}</strong>
                  <small>Soru Labda cevapla</small>
                </button>
              ))}
            </div>
          ) : (
            <p className="empty-state">Henüz AI sorusu yok.</p>
          )}
        </section>
      )}

      {mode === "interview" && (
        <section className="interview-grid">
          <article className="interview-stage">
            <div className="question-meta">
              <span>{activeInterviewQuestion.level}</span>
              <span>{activeInterviewQuestion.category}</span>
              <span>{progress.interviewRunning ? "aktif" : "hazır"}</span>
            </div>
            <h2>{activeInterviewQuestion.prompt}</h2>
            <div className="voice-row">
              <button type="button" className="primary" onClick={startInterview}>
                Mülakatı başlat
              </button>
              <button
                type="button"
                onClick={() => toggleRecording(interviewVoiceTarget)}
                className={
                  isSameVoiceTarget(interviewVoiceTarget) ? "danger-button" : ""
                }
                disabled={
                  isTranscribing ||
                  (isRecording && !isSameVoiceTarget(interviewVoiceTarget))
                }
              >
                {recordingLabel(interviewVoiceTarget)}
              </button>
            </div>
            <textarea
              value={interviewAnswer}
              onChange={(event) => setInterviewAnswer(event.target.value)}
              rows={8}
              placeholder="Sesli cevap transcript'i veya yazılı cevap..."
            />
            <div className="action-row">
              <button
                type="button"
                className="primary"
                onClick={() => void submitInterviewAnswer()}
                disabled={aiLoading === activeInterviewQuestion.id}
              >
                Cevabı gönder ve devam et
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = pickNextInterviewQuestion(activeInterviewQuestion.id);
                  setProgress((current) => ({
                    ...current,
                    activeInterviewQuestionId: next.id,
                    interviewRunning: true,
                  }));
                  setInterviewAnswer("");
                }}
              >
                Soruyu geç
              </button>
            </div>
          </article>

          <aside className="transcript-panel">
            <div className="section-title">
              <span>Mülakat kayıtları</span>
              <strong>{progress.interviewTurns.length}</strong>
            </div>
            <div className="turn-list">
              {progress.interviewTurns.length ? (
                progress.interviewTurns.map((turn) => (
                  <div key={turn.id} className="turn-item">
                    <span>
                      {scoreLabel(turn.score)} · {turn.score}/100
                    </span>
                    <strong>{turn.question}</strong>
                    <p>{turn.answer}</p>
                    <pre>{turn.feedback}</pre>
                  </div>
                ))
              ) : (
                <p className="empty-state">Henüz mülakat cevabı yok.</p>
              )}
            </div>
          </aside>
        </section>
      )}

      {mode === "settings" && (
        <section className="settings-grid">
          <article className="settings-panel">
            <div className="section-title">
              <span>AI provider</span>
            </div>
            <label>
              Provider
              <select
                value={progress.profile.provider}
                onChange={(event) => {
                  const provider = event.target.value as AiProvider;
                  updateProfile({ provider, model: DEFAULT_MODELS[provider] });
                }}
              >
                <option value="local">Local rubrik</option>
                <option value="gemini">Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
              </select>
            </label>
            <label>
              Model
              <input
                value={progress.profile.model}
                onChange={(event) => updateProfile({ model: event.target.value })}
                placeholder="Model adı"
              />
            </label>
            <label>
              API key
              <input
                type="password"
                value={progress.profile.apiKey}
                onChange={(event) => updateProfile({ apiKey: event.target.value })}
                placeholder="Tarayıcı local kayıt"
                autoComplete="off"
              />
            </label>
            <p className="settings-note">
              Keyler sunucuya kaydedilmez. Tarayıcı güvenlik politikası izin
              vermezse AI çağrısı otomatik yerel rubriğe düşer.
            </p>
            <div className="action-row">
              <button
                type="button"
                onClick={() => updateProfile({ apiKey: "", provider: "local" })}
              >
                AI key temizle
              </button>
            </div>
          </article>

          <article className="settings-panel">
            <div className="section-title">
              <span>Ses modu</span>
            </div>
            <label>
              Speech provider
              <select
                value={progress.profile.speechProvider}
                onChange={(event) =>
                  updateProfile({
                    speechProvider: event.target.value as SpeechProvider,
                  })
                }
              >
                <option value="browser">Browser STT</option>
                <option value="deepgram">Deepgram STT</option>
              </select>
            </label>
            <label>
              Deepgram key
              <input
                type="password"
                value={progress.profile.deepgramKey}
                onChange={(event) =>
                  updateProfile({ deepgramKey: event.target.value })
                }
                placeholder="Tarayıcı local kayıt"
                autoComplete="off"
              />
            </label>
            <label>
              STT model
              <input
                value={progress.profile.deepgramSttModel}
                onChange={(event) =>
                  updateProfile({ deepgramSttModel: event.target.value })
                }
              />
            </label>
            <p className="settings-note">
              Ses modu sadece cevap transkripti içindir. Deepgram key varsa
              mikrofon cevabı Deepgram ile Türkçe metne çevrilir; yoksa tarayıcı
              STT denenir.
            </p>
          </article>

          <article className="settings-panel wide">
            <div className="section-title">
              <span>Local veri</span>
            </div>
            <div className="action-row">
              <button type="button" onClick={exportProgress}>
                İlerlemeyi indir
              </button>
              <button type="button" className="danger-button" onClick={resetProgress}>
                Local veriyi sıfırla
              </button>
            </div>
          </article>
        </section>
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
