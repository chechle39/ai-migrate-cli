import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askAI(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a software architecture assistant. Respond with detailed, structured output.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });

    const result = response.choices[0]?.message?.content?.trim();
    return result || 'No response from AI.';
  } catch (error: any) {
    console.error('Error from OpenAI:', error.message);
    throw new Error('Failed to get response from OpenAI.');
  }
}
