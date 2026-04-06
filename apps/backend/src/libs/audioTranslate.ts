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
        return response as unknown as string;
    } catch (error) {
        throw status(500,`Error while translating audio to text: ${error}`);
    }
}
