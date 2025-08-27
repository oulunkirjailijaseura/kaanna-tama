"use client";
import { Check, Copy, Loader2, Send } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import AutoResizingTextarea, {
  type AutoResizingTextareaRef,
} from "@/components/AutoResizingTextarea";
import CreditsMonitor from "@/components/CreditsMonitor";
import LanguageSelect from "@/components/LanguageSelect";
import useLLMTranslate from "@/hooks/useLLMTranslate";
import styles from "./page.module.css";

export default function KaannaTama() {
  const {
    LANGUAGES,
    handleTranslate,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    styleExample,
    setStyleExample,
    textToTranslate,
    setTextToTranslate,
    translation,
    setTranslation,
    isLoading,
  } = useLLMTranslate();

  const [isCopied, setIsCopied] = useState(false);
  const [isMac, setIsMac] = useState<boolean | null>(null);
  const [translationFetched, setTranslationFetched] = useState(false);

  const sourceTextareaRef = useRef<AutoResizingTextareaRef>(null);
  const styleExampleTextareaRef = useRef<AutoResizingTextareaRef>(null);
  const translationTextareaRef = useRef<AutoResizingTextareaRef>(null);

  const handleCopy = useCallback(async () => {
    if (translation.trim() === "") return;

    try {
      await navigator.clipboard.writeText(translation);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, [translation]);

  useEffect(() => {
    const isMacPlatform =
      typeof navigator !== "undefined" &&
      (navigator.platform.startsWith("Mac") || navigator.platform === "iPhone");

    const handleKeyDown = (event: KeyboardEvent) => {
      const modifierKey = isMacPlatform ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl+1: Focus source text
      if (modifierKey && event.key === "1") {
        event.preventDefault();
        sourceTextareaRef.current?.focus();
      }

      // Cmd/Ctrl+2: Focus style example
      if (modifierKey && event.key === "2") {
        event.preventDefault();
        styleExampleTextareaRef.current?.focus();
      }

      // Cmd/Ctrl+3: Focus translation
      if (modifierKey && event.key === "3") {
        event.preventDefault();
        translationTextareaRef.current?.focus();
      }

      // Cmd/Ctrl+Enter: Trigger translation (common pattern, unlikely to conflict)
      if (modifierKey && event.key === "Enter") {
        event.preventDefault();
        if (!isLoading && textToTranslate.trim()) {
          handleTranslate();
          setTranslationFetched(true);
        }
      }

      // Cmd/Ctrl+Shift+C: Copy translation (safe alternative to basic Ctrl+C)
      if (modifierKey && event.shiftKey && event.key === "C") {
        event.preventDefault();
        if (translation.trim()) {
          handleCopy();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    setIsMac(isMacPlatform);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoading, textToTranslate, translation, handleTranslate, handleCopy]);

  const handleTextToTranslateChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextToTranslate(e.target.value);
    },
    [setTextToTranslate]
  );

  const handleExampleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setStyleExample(e.target.value);
    },
    [setStyleExample]
  );

  const handleTranslationChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTranslation(e.target.value);
    },
    [setTranslation]
  );

  const modifierKeyText = isMac === null ? "Ctrl" : isMac ? "⌘" : "Ctrl";

  return (
    <main className={`min-h-screen p-4 ${styles["main-container"]}`}>
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/kaanna-tama.png"
              alt="Käännä tämä"
              className="h-8 w-8"
              width={32}
              height={32}
            />
            <h1 className={`text-3xl font-bold ${styles["text-foreground"]}`}>
              Käännä tämä
            </h1>
          </div>
          <div
            className={`text-xs ${styles["text-foreground"]} opacity-60 mt-2`}
          >
            Pikanäppäimet: {modifierKeyText}+1 (teksti), {modifierKeyText}+2
            (esimerkki), {modifierKeyText}+3 (käännös),
            {` `}
            {modifierKeyText}+Enter (käännä), {modifierKeyText}+Shift+C (kopioi)
          </div>
        </header>

        <section
          className={`rounded-xl shadow-lg p-6 mb-6 ${styles["card-style"]}`}
        >
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LanguageSelect
                labelText="Lähdekieli"
                id="source-language"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                LANGUAGES={LANGUAGES}
                styles={styles}
              />
              <LanguageSelect
                labelText="Käännöskieli"
                id="target-language"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                LANGUAGES={LANGUAGES}
                styles={styles}
              />
            </div>

            <div>
              <label
                htmlFor="textToTranslate"
                className={`block text-sm font-medium mb-2 ${styles["text-foreground"]}`}
              >
                Käännettävä teksti ({modifierKeyText}+1)
              </label>
              <AutoResizingTextarea
                ref={sourceTextareaRef}
                id="textToTranslate"
                value={textToTranslate}
                onChange={handleTextToTranslateChange}
                placeholder="Anna käännettävä teksti"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none overflow-hidden ${styles["input-style"]}`}
              />
            </div>

            <div>
              <label
                htmlFor="styleExample"
                className={`block text-sm font-medium mb-2 ${styles["text-foreground"]}`}
              >
                Esimerkki käännöksen tyyliä ja kieltä varten ({modifierKeyText}
                +2)
              </label>
              <AutoResizingTextarea
                ref={styleExampleTextareaRef}
                id="styleExample"
                value={styleExample}
                onChange={handleExampleChange}
                placeholder="Anna esimerkki käännöksen tyyliä ja kieltä varten"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none overflow-hidden ${styles["input-style"]}`}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                onClick={handleTranslate}
                disabled={isLoading || !textToTranslate.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={`Käännä (${modifierKeyText}+Enter)`}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isLoading ? "Käännetään..." : "Käännä"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="translation"
                className={`block text-sm font-medium ${styles["text-foreground"]}`}
              >
                Käännös ({modifierKeyText}+3)
              </label>
              {translation && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md hover:bg-indigo-200 transition-colors ${styles["copy-button"]}`}
                  title={`Kopioi käännös (${modifierKeyText}+Shift+C)`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Kopioitu!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Kopioi
                    </>
                  )}
                </button>
              )}
            </div>
            <AutoResizingTextarea
              ref={translationTextareaRef}
              id="translation"
              value={translation}
              onChange={handleTranslationChange}
              placeholder="Käännös ilmestyy tänne..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none overflow-hidden ${styles["input-style"]} ${styles["translation-input-style"]}`}
            />
          </div>
          {textToTranslate.trim() !== "" &&
            styleExample.trim() !== "" &&
            translation.trim() !== "" && (
              <div className="flex items-center justify-center mt-4">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => {
                    setTextToTranslate("");
                    setStyleExample("");
                    setTranslation("");
                  }}
                >
                  Tyhjennä
                </button>
              </div>
            )}
        </section>
      </div>
      <section className="flex justify-center">
        <CreditsMonitor fetchTrigger={translationFetched} />
      </section>
    </main>
  );
}
