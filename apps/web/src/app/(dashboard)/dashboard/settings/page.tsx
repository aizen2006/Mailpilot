import { ExtensionLinkSection } from "./ExtensionLinkSection";

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
            <p className="mt-2 text-sm text-zinc-600">
                Profile and Gmail controls will expand here. Extension linking is available below.
            </p>
            <ExtensionLinkSection />
        </div>
    );
}
