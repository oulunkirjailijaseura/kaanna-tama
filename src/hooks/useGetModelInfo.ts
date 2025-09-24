import { useEffect, useState } from "react";
import type { Model } from "@/app/api/models/route";

export default function useGetModelInfo() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | undefined>(
    undefined
  );

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data: Model[]) => {
        setModels(data);
        return data;
      })
      .then((data: Model[]) =>
        setSelectedModel(data.find((model) => model.name === "gpt-4o-mini"))
      );
  }, []);

  return { models, selectedModel, setSelectedModel };
}
