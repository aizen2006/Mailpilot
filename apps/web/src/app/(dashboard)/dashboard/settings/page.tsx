import { ExtensionLinkSection } from "./ExtensionLinkSection"

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--mp-text)" }}>
        Settings
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: "var(--mp-text-muted)" }}>
        Account preferences and extension linking.
      </p>

      <ExtensionLinkSection />
    </div>
  )
}
