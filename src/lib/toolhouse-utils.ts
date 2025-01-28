// src/lib/toolhouse-utils.ts
import { Toolhouse } from '@toolhouseai/sdk';
import OpenAI from 'openai';

const MODEL = 'gpt-4o-mini';

if (!process.env.NEXT_PUBLIC_TOOLHOUSE_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_TOOLHOUSE_API_KEY');
}

if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_GROQ_API_KEY');
}

export const toolhouse = new Toolhouse({
  apiKey: process.env.NEXT_PUBLIC_TOOLHOUSE_API_KEY,
  metadata: {
    id: "assistant",
    timezone: "0"
  }
});

export const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function processMessage(content: string) {
  try {
    // Get tools from Toolhouse
    const tools = await toolhouse.getTools() as OpenAI.Chat.Completions.ChatCompletionTool[];
    
    // Initial completion with tools
    const initialMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
      role: "user",
      content: content,
    }];

    const chatCompletion = await openai.chat.completions.create({
      messages: initialMessages,
      model: MODEL,
      tools
    });

    // Run tools based on the completion
    const toolhouseMessages = await toolhouse.runTools(chatCompletion) as OpenAI.Chat.Completions.ChatCompletionMessageParam[];

    // Get final completion with tool results
    const finalMessages = [...initialMessages, ...toolhouseMessages];
    const finalCompletion = await openai.chat.completions.create({
      messages: finalMessages,
      model: MODEL,
      tools
    });

    return finalCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that request.";
  } catch (error) {
    console.error('Error processing message:', error);
    throw error;
  }
}