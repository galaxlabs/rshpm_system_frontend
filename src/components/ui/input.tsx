import * as React from "react"

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none
      border-[rgb(var(--input))] focus:ring-2 focus:ring-[rgb(var(--ring))]
      ${props.className ?? ""}`}
    />
  )
}
