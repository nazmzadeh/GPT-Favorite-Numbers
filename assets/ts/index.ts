import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

//Creating a new instance of the OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY

});

async function generateNumbers(count: number): Promise<number[]> {
    const numbers: number[] = [];
    for (let i = 0; i < count; i++) {
        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            // Prompt asking the model to generate a random number between 0 and 100
            messages: [{ role: 'user', content: 'Reply a random valid stringified number from 0 to 100. For example: "58". Do not use code for this.' }],
            model: 'gpt-4o-mini',
        };
        //Sending a request to the OpenAI API
        const chatCompletion: OpenAI.Chat.ChatCompletion = await client.chat.completions.create(params);
        //Extracting the generated number from the API response, triming any extra whitespace, and converting it from a string to an integer
        const number = parseInt(chatCompletion.choices[0].message.content?.replace(/"/g, '').trim() ?? 'No content returned', 10)
        console.log("Number:", chatCompletion.choices[0].message.content?.trim().replace(/"/g, ''))
        !isNaN(number) && numbers.push(number);
    }
    return numbers
}
async function main() {
    const numbers = await generateNumbers(10)
    console.log("Numbers:", numbers);

}
main()