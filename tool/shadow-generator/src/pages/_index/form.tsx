import { FormEvent, ReactNode } from "react";

import { cn } from "@/lib/cn";

export function InputField({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex items-center gap-2", className)}>
      {children}
    </label>
  );
}

export function InputText({
  value,
  min = 0,
  max = 1,
  onChange,
  className,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  function handleChange(e: FormEvent<HTMLInputElement>) {
    onChange(Number(e.currentTarget.value || 0));
  }
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      className={cn(
        "w-0 grow rounded border bg-white px-2 py-1 outline-none",
        className
      )}
      onChange={handleChange}
    />
  );
}

export function InputSlider({
  value,
  onChange,
  className,
  min = 0,
  max = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
}) {
  function handleChange(e: FormEvent<HTMLInputElement>) {
    onChange(Number(e.currentTarget.value || 0));
  }
  return (
    <>
      <input
        type="range"
        className={cn("w-0 grow outline-none", className)}
        value={value}
        max={max}
        min={min}
        step={0.01}
        onChange={handleChange}
      />
      <input
        type="text"
        className="w-[4em] rounded border bg-white px-2 py-1 outline-none"
        value={value}
        onChange={handleChange}
      />
    </>
  );
}
