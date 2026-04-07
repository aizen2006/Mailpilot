import type { Buffer } from "buffer";
import { status } from "elysia";
import { SarvamAIClient } from "sarvamai";
import 'dotenv/config';

export const sarvam = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY!,
});

export default async function audioTranslate(audio: Buffer){
    try {
        const response = await sarvam.speechToText.translate({
            file:audio,
            model: "saaras:v2.5"
        });
        if (typeof response === "string") {
            return response;
        }
        const maybeTranscript =
            response && typeof response === "object" && "transcript" in response
                ? (response as { transcript?: unknown }).transcript
                : null;
        if (typeof maybeTranscript !== "string" || maybeTranscript.trim().length === 0) {
            throw status(502, "Invalid transcription response");
        }
        return maybeTranscript;
    } catch (error) {
        throw status(500,`Error while translating audio to text: ${error}`);
    }
}
