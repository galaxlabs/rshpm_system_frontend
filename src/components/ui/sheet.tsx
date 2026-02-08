import * as React from "react"

const Ctx = React.createContext<{
  open: boolean
  setOpen: (v: boolean) => void
} | null>(null)

export function Sheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>
}

export function SheetTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(Ctx)!
  const child = React.cloneElement(children, {
    onClick: () => ctx.setOpen(true),
  })
  return asChild ? child : child
}

export function SheetContent({ side = "right", className = "", children }: { side?: "right"; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(Ctx)!
  if (!ctx.open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={() => ctx.setOpen(false)} />
      <div
        className={`absolute top-0 ${side === "right" ? "right-0" : ""} h-full w-[380px] bg-white border-l
        border-[rgb(var(--border))] shadow-xl p-4 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-3">{children}</div>
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-lg font-semibold">{children}</div>
}
