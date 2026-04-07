import { useCallback, useRef, useState } from "react"

type UseSendAudioOptions = {
  sendAudioBlob: (blob: Blob) => Promise<boolean>
  disabled?: boolean
}

export function useSendAudio({ sendAudioBlob, disabled = false }: UseSendAudioOptions) {
  const [isRecording, setIsRecording] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const stopStreamTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const startRecording = useCallback(async () => {
    if (disabled || isRecording) return
    setMicError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mimeCandidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ]
      const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? ""
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stopStreamTracks()
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        })
        chunksRef.current = []
        mediaRecorderRef.current = null
        setIsRecording(false)
        if (blob.size > 0) {
          void sendAudioBlob(blob)
        }
      }
      mediaRecorderRef.current = recorder
      recorder.start(200)
      setIsRecording(true)
    } catch (e) {
      stopStreamTracks()
      setMicError(e instanceof Error ? e.message : "Microphone access denied")
      setIsRecording(false)
    }
  }, [disabled, isRecording, sendAudioBlob, stopStreamTracks])

  const stopRecording = useCallback(() => {
    const rec = mediaRecorderRef.current
    if (rec && rec.state !== "inactive") {
      rec.stop()
    } else {
      stopStreamTracks()
      setIsRecording(false)
    }
  }, [stopStreamTracks])

  return {
    isRecording,
    micError,
    startRecording,
    stopRecording,
  }
}
