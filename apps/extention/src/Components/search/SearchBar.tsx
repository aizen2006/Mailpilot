import { Badge } from "~Components/ui/Badge"
import { Button } from "~Components/ui/Button"
import { TextArea } from "~Components/ui/Input"

const tones = ["Professional", "Concise", "Quick reply"]

export function SearchBar() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-sm font-semibold text-[var(--color-text)]">Generate reply</h2>
        <Badge variant="tone">Active persona</Badge>
      </div>

      <div className="space-y-3">
        <TextArea placeholder="Reply to sender, summarize context, or write a follow-up…" rows={3} />
        <div className="flex flex-wrap items-end justify-between gap-3">
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
