import React from "react";

export interface FieldProps {
  name: string;
  label: string;
  type?: "text" | "email" | "url";
  placeholder?: string;
  required?: boolean;
  autocomplete?: string;
  multiline?: boolean;
  rows?: number;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  className?: string;
  children?: React.ReactNode;
}

export type TagProps = FieldProps;

const inputCls =
  "w-full bg-transparent text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)] border-b border-[var(--color-bg-neutral-2)] focus:border-[var(--color-ink)] outline-none py-2 text-base transition-colors duration-[var(--duration-fast)]";

export const Field: React.FC<FieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  autocomplete,
  multiline = false,
  rows = 4,
  value,
  defaultValue,
  onChange,
  className = "",
  children,
}) => {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`.trim()}>
      <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-ink-mute)]">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>
      {multiline ? (
        <textarea
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          className={inputCls}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autocomplete}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          className={inputCls}
        />
      )}
      {children}
    </label>
  );
};

export default Field;
