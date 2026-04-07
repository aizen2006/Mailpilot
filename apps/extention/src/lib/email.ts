export type ParsedEmail = {
  subject: string
  body: string
}

export function parseEmailFromText(text: string): ParsedEmail | null {
  const normalized = text.replace(/\r\n/g, "\n")
  const lines = normalized.split("\n")
  const subjectLineIndex = lines.findIndex((line) => /^subject\s*:/i.test(line.trim()))
  if (subjectLineIndex < 0) return null

  const rawSubject = lines[subjectLineIndex]?.replace(/^subject\s*:/i, "").trim()
  if (!rawSubject) return null

  const body = lines
    .slice(subjectLineIndex + 1)
    .join("\n")
    .trim()
  if (!body) return null

  return {
    subject: rawSubject,
    body,
  }
}

export function buildSendInstruction(to: string, subject: string, body: string): string {
  return [
    "Send this email now using my connected Gmail account.",
    `To: ${to.trim()}`,
    `Subject: ${subject.trim()}`,
    "",
    body.trim(),
  ].join("\n")
}
