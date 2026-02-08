import * as React from "react"

export function Select({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <select
      className="w-full rounded-md border px-3 py-2 text-sm bg-white border-[rgb(var(--input))]"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {children}
    </select>
  )
}

export function SelectTrigger({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}
export function SelectValue() { return null }
export function SelectContent({ children }: { children: React.ReactNode }) { return <>{children}</> }
export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>
}
