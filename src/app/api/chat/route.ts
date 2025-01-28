// src/app/api/chat/route.ts
import { Toolhouse } from '@toolhouseai/sdk';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const MODEL = 'llama3-8b-8192';

const toolhouse = new Toolhouse({
  apiKey: process.env.TOOLHOUSE_API_KEY,
  metadata: {
    id: "assistant",
    timezone: "0"
  }
});

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

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

    return NextResponse.json({ 
      message: finalCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that request." 
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}