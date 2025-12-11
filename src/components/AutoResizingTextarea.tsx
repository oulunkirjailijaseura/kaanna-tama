import type React from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import styles from "./AutoResizingTextarea.module.css";

export interface AutoResizingTextareaRef {
  focus: () => void;
}

interface AutoResizingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  minHeight?: number;
}

const AutoResizingTextarea = forwardRef<
  AutoResizingTextareaRef,
  AutoResizingTextareaProps
>(({ value, onChange, minHeight = 120, ...props }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    },
  }));

  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        minHeight
      )}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    autoResize();
  }, [autoResize]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onFocus={autoResize}
      className={`${props.className} ${styles["text-styles"]}`}
      placeholder={props.placeholder}
      id={props.id}
      disabled={props.disabled}
      readOnly={props.readOnly}
    />
  );
});

AutoResizingTextarea.displayName = "AutoResizingTextarea";

export default AutoResizingTextarea;
