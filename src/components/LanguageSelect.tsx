import type React from "react";
import type { Languages } from "@/consts";

interface LanguageSelectProps {
  labelText: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  LANGUAGES: Languages;
  styles: Record<string, string>;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  labelText,
  id,
  value,
  onChange,
  LANGUAGES,
  styles,
}) => {
  return (
    <div>
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
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${styles["input-style"]}`}
      >
        {Object.entries(LANGUAGES).map(([lang, name]) => (
          <option key={lang} value={lang}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelect;
