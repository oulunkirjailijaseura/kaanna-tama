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

export type Languages = typeof LANGUAGES;
export type Language = keyof typeof LANGUAGES;
export type LanguageName = (typeof LANGUAGES)[Language];
