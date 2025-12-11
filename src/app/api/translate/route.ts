import deepl, {
  type SourceLanguageCode,
  type TargetLanguageCode,
} from "deepl-node";
import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { DEEPL_LANGUAGES, LANGUAGES } from "@/consts";
import type { Model } from "../models/route";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const deeplClient = process.env.DEEPL_API_KEY
  ? new deepl.DeepLClient(process.env.DEEPL_API_KEY)
  : undefined;

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const chatGptRequest = async ({
  styleExample,
  sourceLanguage,
  targetLanguage,
  textToTranslate,
  model,
}: {
  styleExample: string;
  sourceLanguage: string;
  targetLanguage: string;
  textToTranslate: string;
  model: Model["name"];
}): Promise<string> => {
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
    model: model,
    messages: messages,
    max_tokens: 1000,
    temperature: 0.3,
  });
  return response.choices[0]?.message.content?.trim() ?? "";
};

const deeplRequest = async ({
  sourceLanguage,
  targetLanguage,
  textToTranslate,
  styleExample,
}: {
  sourceLanguage: string;
  targetLanguage: string;
  textToTranslate: string;
  styleExample: string;
}) => {
  const targetLanguageCode = DEEPL_LANGUAGES[
    targetLanguage as keyof typeof DEEPL_LANGUAGES
  ] as TargetLanguageCode;
  if (!targetLanguageCode) {
    throw new Error("Invalid target language");
  }
  const sourceLanguageCode = DEEPL_LANGUAGES[
    sourceLanguage as keyof typeof DEEPL_LANGUAGES
  ] as SourceLanguageCode;
  if (!sourceLanguageCode) {
    throw new Error("Invalid source language");
  }

  if (!deeplClient) {
    throw new Error("DeepL API key not set");
  }

  const result = await deeplClient.translateText(
    textToTranslate,
    sourceLanguageCode,
    targetLanguageCode,
    { context: styleExample, modelType: "prefer_quality_optimized" }
  );
  return result.text;
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

    const translation =
      model === "deepl"
        ? await deeplRequest({
            sourceLanguage,
            targetLanguage,
            textToTranslate,
            styleExample,
          })
        : await chatGptRequest({
            styleExample,
            sourceLanguage,
            targetLanguage,
            textToTranslate,
            model,
          });

    return NextResponse.json({
      translation,
    });
  } catch (error) {
    console.error("Translation failed", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
