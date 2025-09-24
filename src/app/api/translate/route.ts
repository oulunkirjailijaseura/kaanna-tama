import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { LANGUAGES } from "@/consts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export async function POST(request: NextRequest) {
  try {
    const {
      sourceLanguage,
      targetLanguage,
      styleExample,
      textToTranslate,
      model,
    } = await request.json();

    const sourceLanguageValid =
      typeof sourceLanguage === "string" &&
      Object.keys(LANGUAGES).includes(sourceLanguage);
    const targetLanguageValid =
      typeof targetLanguage === "string" &&
      Object.keys(LANGUAGES).includes(targetLanguage);

    if (!sourceLanguageValid || !targetLanguageValid) {
      return NextResponse.json(
        {
          error: "Invalid language",
          field: sourceLanguageValid ? "targetLanguage" : "sourceLanguage",
        },
        { status: 400 }
      );
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are a highly skilled translation engine. Your sole purpose is to accurately translate text while strictly adhering to the provided instructions.`,
      },
      {
        role: "user",
        content: styleExample.trim()
          ? `You are provided with a source text in ${capitalize(
              sourceLanguage
            )} and a target language ${capitalize(targetLanguage)}.
Your task is to translate the source text into the target language.

Observe the following style example to match the tone, vocabulary, and sentence structure:
---
STYLE EXAMPLE:
${styleExample}
---

SOURCE TEXT:
${textToTranslate}

Provide only the translated text. Do not include any additional commentary, notes, or explanations. If you cannot perfectly match the style, prioritize an accurate translation.`
          : `You are provided with a source text in ${capitalize(
              sourceLanguage
            )} and a target language ${capitalize(targetLanguage)}.
Your task is to translate the source text into the target language.

SOURCE TEXT:
${textToTranslate}

Provide only the translated text. Do not include any additional commentary, notes, or explanations.`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.3,
    });

    return NextResponse.json({
      translation: response.choices[0]?.message.content?.trim() ?? "",
    });
  } catch (error) {
    console.error("Translation failed", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
