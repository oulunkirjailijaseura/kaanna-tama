export const LANGUAGES = {
  finnish: "Suomi",
  english: "Englanti",
  spanish: "Espanja",
  french: "Ranska",
  german: "Saksan",
  italian: "Italia",
  portuguese: "Portugali",
  russian: "Venäjä",
  japanese: "Japani",
  korean: "Korea",
  chinese: "Kiina",
  arabic: "Arabia",
  hindi: "Hindi",
  dutch: "Hollanti",
  swedish: "Ruotsi",
  norwegian: "Norja",
  danish: "Tanska",
} as const;

export const DEEPL_LANGUAGES = {
  finnish: "fi",
  english: "en",
  spanish: "es",
  french: "fr",
  german: "de",
  italian: "it",
  portuguese: "pt",
  russian: "ru",
  japanese: "ja",
  korean: "ko",
  chinese: "zh",
  arabic: "ar",
  hindi: "hi",
  dutch: "nl",
  swedish: "sv",
  norwegian: "no",
  danish: "da",
} as const;

export type Languages = typeof LANGUAGES;
export type Language = keyof typeof LANGUAGES;
export type LanguageName = (typeof LANGUAGES)[Language];
