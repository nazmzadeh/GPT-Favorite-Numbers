import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();
//Creating a new instance of the OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
async function generateNumbers(count) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        const params = {
            // Prompt asking the model to generate a random number between 0 and 100
            messages: [{ role: 'user', content: 'Reply a random valid stringified number from 0 to 100. For example: "58". Do not use code for this.' }],
            model: 'gpt-4o-mini',
            temperature: 0.9
        };
        //Sending a request to the OpenAI API
        const chatCompletion = await client.chat.completions.create(params);
        //Extracting the generated number from the API response, triming any extra whitespace, and converting it from a string to an integer
        const number = parseInt(chatCompletion.choices[0].message.content?.replace(/"/g, '').trim() ?? 'No content returned', 10);
        // console.log("Number:", chatCompletion.choices[0].message.content?.trim().replace(/"/g, ''))
        !isNaN(number) && numbers.push(number);
    }
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
    const numbers = await generateNumbers(20);
    console.log("Numbers:", numbers);
    const frequency = calculateFrequency(numbers);
    plotChart(frequency);
}
main();
