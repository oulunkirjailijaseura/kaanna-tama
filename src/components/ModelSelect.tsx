import type React from "react";
import { useCallback } from "react";
import type { Model } from "@/app/api/models/route";

interface ModelSelectProps {
  labelText: string;
  id: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  models: Model[];
  styles: Record<string, string>;
  className?: string;
  forwardedRef?: React.Ref<HTMLSelectElement>;
}

const ModelSelect: React.FC<ModelSelectProps> = ({
  labelText,
  id,
  value,
  onChange,
  models,
  styles,
  className,
  forwardedRef,
}) => {
  const sortedModels = [...models].sort((a, b) => a.totalCost - b.totalCost);

  const costs = sortedModels.map((model) => model.totalCost);
  const numModels = costs.length;

  const getCostVisualization = useCallback(
    (totalCost: number): string => {
      if (numModels === 0) return "";

      // Define 5 thresholds for $, $$, $$$, $$$$, $$$$$
      // These thresholds represent the 20th, 40th, 60th, and 80th percentiles of the cost data
      const p20 = costs[Math.floor(numModels * 0.2)] || 0;
      const p40 = costs[Math.floor(numModels * 0.4)] || 0;
      const p60 = costs[Math.floor(numModels * 0.6)] || 0;
      const p80 = costs[Math.floor(numModels * 0.8)] || 0;

      if (totalCost <= p20) {
        return "$";
      } else if (totalCost <= p40) {
        return "$$";
      } else if (totalCost <= p60) {
        return "$$$";
      } else if (totalCost <= p80) {
        return "$$$$";
      } else {
        return "$$$$$";
      }
    },
    [costs, numModels]
  );

  return (
    <div className={className}>
      <label
        className={`block text-sm font-medium mb-2 ${styles["text-foreground"]}`}
        htmlFor={id}
      >
        {labelText}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        ref={forwardedRef}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${styles["input-style"]}`}
      >
        {sortedModels.map((model) => (
          <option key={model.name} value={model.name}>
            {model.name} {getCostVisualization(model.totalCost)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelect;
