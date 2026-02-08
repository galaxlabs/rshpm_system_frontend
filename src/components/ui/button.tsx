import * as React from "react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline"
}

export function Button({ variant = "default", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition border"
  const styles =
    variant === "outline"
      ? "bg-transparent border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]"
      : "bg-primary text-primary-foreground border-transparent hover:opacity-90"
  return <button className={`${base} ${styles} ${className}`} {...props} />
}
