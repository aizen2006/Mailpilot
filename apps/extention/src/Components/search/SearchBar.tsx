import { Badge } from "~Components/ui/Badge"
import { Button } from "~Components/ui/Button"
import { TextArea } from "~Components/ui/Input"

const tones = ["Professional", "Concise", "Quick Reply"]

export function SearchBar() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)]">Generate Reply</h2>
        <Badge variant="tone">Active Persona</Badge>
      </div>

      <div className="space-y-3">
        <TextArea placeholder="Reply to sender, summarize context, or write a follow-up..." rows={3} />
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {tones.map((tone) => (
              <Badge key={tone} className="cursor-default">
                {tone}
              </Badge>
            ))}
          </div>
          <Button>Generate</Button>
        </div>
      </div>
    </div>
  )
}
