import { NextResponse } from "next/server";

export interface Model {
  name: string;
  inputCost: number; // cost per 1k tokens
  outputCost: number; // cost per 1k tokens
  contextCost: number; // cost per 1M tokens
  totalCost: number;
}

const calculateTotalCost = (model: Omit<Model, "totalCost">): number => {
  return model.inputCost + model.outputCost + model.contextCost;
};

export const models: Model[] = [
  { name: "gpt-5", inputCost: 1.25, outputCost: 0.125, contextCost: 10.0 },
  { name: "gpt-5-mini", inputCost: 0.25, outputCost: 0.025, contextCost: 2.0 },
  { name: "gpt-5-nano", inputCost: 0.05, outputCost: 0.005, contextCost: 0.4 },
  { name: "gpt-4.1", inputCost: 2.0, outputCost: 0.5, contextCost: 8.0 },
  { name: "gpt-4.1-mini", inputCost: 0.4, outputCost: 0.1, contextCost: 1.6 },
  { name: "gpt-4.1-nano", inputCost: 0.1, outputCost: 0.025, contextCost: 0.4 },
  {
    name: "gpt-4o-mini",
    inputCost: 0.00015,
    outputCost: 0.00015,
    contextCost: 0.00015,
  },
  ...(process.env.DEEPL_API_KEY
    ? [{ name: "deepl", inputCost: 2, outputCost: 2, contextCost: 2 }]
    : []),
].map((model) => ({
  ...model,
  totalCost: calculateTotalCost(model),
}));

export async function GET() {
  return NextResponse.json(models);
}
