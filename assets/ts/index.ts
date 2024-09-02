import OpenAI from 'openai';
import dotenv from 'dotenv';
import { encoding_for_model } from 'tiktoken';

dotenv.config();

// Creating a new instance of the OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


//Generate `count` five-sentence summaries for `count` random topics
async function getSummaries(count: number): Promise<string[]> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [{ role: 'user', content: `Generate ${count} five-sentence summaries on ${count} different random topics.` }],
        model: 'gpt-4o-mini',
    };

    const chatCompletion: OpenAI.Chat.ChatCompletion = await client.chat.completions.create(params);
    const content = chatCompletion.choices[0]?.message?.content ?? "No content returned :("
    const summaries = content.split('\n').filter((line) => line.trim() !== '');
    console.log("Summaries:", summaries)
    return summaries;
}
//Count the number of tokens in each of the summaries 
function countTokens(text: string): number {
    const enc = encoding_for_model('gpt-4o-mini');
    const tokens = enc.encode(text);
    return tokens.length;
}

async function generateNumber(count: number): Promise<string> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [{ role: 'user', content: `Now count the number of tokens in each of the summaries mod 10, and print those ${count} numbers one after the other. Your response should be ${count} digits like '47'` }],
        model: 'gpt-4o-mini',
    };
    const summaries = await getSummaries(count);
    if (summaries.length < count) {
        throw new Error(`Less than ${count} summaries generated`);
    }
    let temp = '';
    for (let i = 0; i < count; i++) {
        const digit = countTokens(summaries[i]) % 10;
        temp += digit.toString();
    }
    return temp

}

async function main() {
    const number = await generateNumber(2);
    console.log(`Generated number:`, number);
}

main();
