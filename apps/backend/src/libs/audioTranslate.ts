import { sarvam } from "./sarvam";
import { status } from "elysia";
import { Buffer } from "buffer";

export default function audioTranslate(audio:Buffer){
    try {
        const response = await sarvam.speechToText({
            file:audio,
            model:"sarvam-30b",
            temperature:0.5,
            top_p:0.5,
            reasoning_effort:"medium"
        });
        return status(200,'Audio translated to text successfully',response)
    } catch (error) {
        throw status(500,'Error while translating audio to text',error as Error)
    }
}