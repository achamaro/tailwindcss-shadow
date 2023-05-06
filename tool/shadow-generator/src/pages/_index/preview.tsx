import {
  generateShadow,
  GenerateShadowOptions,
} from "@achamaro/tailwindcss-shadow";
import { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type PreviewProps = {
  z: number;
  options: Required<GenerateShadowOptions>;
  className?: string;
  children?: ReactNode;
};
export default function Preview({
  z,
  options,
  className,
  children,
}: PreviewProps) {
  const shadows = generateShadow(z, options);
  const translate = options.offset
    .map((v) => (v * 10 * z).toFixed(2) + "px")
    .join(", ");
  const style = {
    boxShadow: shadows.join(", "),
    transform: `translate(${translate}) scale(${1 + 0.1 * z})`,
  };

  return (
    <div
      className={cn(
        "aspect-square rounded border border-white/40 bg-white/30 p-3 text-gray-600",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
