import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();
//Creating a new instance of the OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
async function generateNumbers(count) {
    const prompt = 'Reply a random valid stringified number from 0 to 100. For example: "58". Do not use code for this.';
    const params = {
        // Prompt asking the model to generate a random number between 0 and 100
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o-mini',
        //? Making this generation more random
        temperature: 0.8
    };
    const requests = Array.from({ length: count }, () => client.chat.completions.create(params));
    const responses = await Promise.all(requests);
    const numbers = responses.map((response) => {
        //Extracting the generated number from the API response, trimming any extra whitespace, and converting it from a string to an integer
        const numberStr = response.choices[0]?.message.content?.replace(/"/g, '').trim() ?? '';
        const number = parseInt(numberStr, 10);
        return !isNaN(number) && number >= 0 && number <= 100 && number;
    }).filter((number) => number !== null);
    return numbers;
}
function calculateFrequency(numbers) {
    const frequency = Array(101).fill(0);
    // Count the occurrences of each number
    numbers.forEach(number => {
        frequency[number]++;
    });
    return frequency;
}
// Plotting distribution of resulting numbers
function plotChart(frequency) {
    const maxFrequency = Math.max(...frequency);
    const chartHeight = 20;
    // Print the chart bars
    for (let i = chartHeight; i > 0; i--) {
        let row = '';
        for (let j = 0; j < frequency.length; j++) {
            if (frequency[j] / maxFrequency * chartHeight >= i) {
                row += ' █'; // Use block character to represent the bar
            }
            else {
                row += '  ';
            }
        }
        console.log(row);
    }
    // Print the numbers below the chart
    let numbersRow = '';
    for (let j = 0; j < frequency.length; j++) {
        if (frequency[j] > 0) {
            numbersRow += `${j}`;
        }
        else {
            numbersRow += '  ';
        }
    }
    console.log(numbersRow);
}
async function main() {
    const numbers = await generateNumbers(25);
    console.log("Generated numbers:", numbers);
    const frequency = calculateFrequency(numbers);
    plotChart(frequency);
}
main();
