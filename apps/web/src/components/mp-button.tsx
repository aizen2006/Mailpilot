import type { ButtonHTMLAttributes } from "react"

type MpButtonVariant = "primary" | "secondary" | "ghost"

type MpButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: MpButtonVariant
}

export function MpButton({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: MpButtonProps) {
  const base = [
    "inline-flex items-center justify-center",
    "rounded-(--mp-radius-md) px-4 py-2.5",
    "text-sm font-semibold",
    // Emil: transition only transform + shadow (not `all`) to stay GPU-fast
    "transition-[transform,box-shadow,filter] duration-160",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:outline-[var(--mp-focus)]",
    "disabled:pointer-events-none disabled:opacity-50",
    // Emil: scale(0.97) on :active gives instant tactile feedback
    "active:scale-[0.97]",
  ].join(" ")

  const styles: Record<MpButtonVariant, string> = {
    primary: [
      "bg-gradient-to-br from-[var(--mp-primary)] to-[var(--mp-primary-deep)]",
      "text-white",
      "shadow-md shadow-[rgba(15,118,110,0.25)]",
      "hover:shadow-lg hover:shadow-[rgba(15,118,110,0.35)]",
    ].join(" "),
    secondary: [
      "bg-[var(--mp-surface)] text-[var(--mp-text)]",
      "border border-[var(--mp-border)]",
      "hover:bg-[var(--mp-elevated)]",
    ].join(" "),
    ghost: [
      "text-[var(--mp-text-muted)]",
      "hover:bg-[var(--mp-surface)] hover:text-[var(--mp-text)]",
    ].join(" "),
  }

  return (
    <button
      className={`${base} ${styles[variant]} ${className}`}
      type={type}
      {...props}
    />
  )
}
