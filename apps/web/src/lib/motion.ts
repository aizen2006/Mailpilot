import type { Variants } from "motion/react"

// ── Custom easing ───────────────────────────────────────────────────────────
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

// ── Spring configs ──────────────────────────────────────────────────────────
export const springSnap = { type: "spring", duration: 0.25, bounce: 0.1 } as const
export const springBouncy = { type: "spring", duration: 0.35, bounce: 0.2 } as const

// ── Fade + slide up (page enter, card enter) ────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: 0.15, ease: EASE_OUT },
  },
}

// ── Scale + fade (auth card, modals) ────────────────────────────────────────
export const scaleFade: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.15, ease: EASE_OUT },
  },
}

// ── Stagger container ───────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

// ── Stagger item (use inside staggerContainer) ──────────────────────────────
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
}
