import { useCallback, useState } from "react";
import { LANGUAGES } from "@/consts";

export default function useLLMTranslate() {
  const languageKeys = Object.keys(LANGUAGES);
  const [sourceLanguage, setSourceLanguage] = useState(languageKeys[0]);
  const [targetLanguage, setTargetLanguage] = useState(languageKeys[1]);
  const [styleExample, setStyleExample] = useState("");
  const [textToTranslate, setTextToTranslate] = useState("");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (!textToTranslate.trim()) {
      alert("Täytä käännettävä teksti");
      return;
    }

    setIsLoading(true);
    setTranslation("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLanguage,
          targetLanguage,
          styleExample,
          textToTranslate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Käännös epäonnistui");
      }

      const data = await response.json();
      setTranslation(data.translation);
    } catch (error: unknown) {
      console.error("Translation error:", error);
      setTranslation(
        `Virhe: ${error instanceof Error ? error.message : "Tuntematon virhe"}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [sourceLanguage, targetLanguage, styleExample, textToTranslate]);

  return {
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
    LANGUAGES,
  };
}
