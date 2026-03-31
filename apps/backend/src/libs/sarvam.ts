import { SarvamAIClient } from 'sarvam-ai';
import 'dotenv/config';

export const sarvam = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});
