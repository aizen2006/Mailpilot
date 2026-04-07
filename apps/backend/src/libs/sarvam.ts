import { SarvamAIClient } from "sarvamai";
import 'dotenv/config';

export const sarvam = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});
