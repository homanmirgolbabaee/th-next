// src/app/api/chat/route.ts
import { Toolhouse } from '@toolhouseai/sdk';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const MODEL = 'llama-3.1-8b-instant';

if (!process.env.TOOLHOUSE_API_KEY) {
  throw new Error('Missing TOOLHOUSE_API_KEY');
}

if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY');
}

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

function formatToolResponse(toolResults: any[]) {
  let formattedResponse = '';
  
  for (const result of toolResults) {
    if (result.role === 'tool' && result.content) {
      // Handle tweet formatting
      if (result.name === 'search_x' && result.content.includes('<tweet>')) {
        const tweets = result.content
          .split('<tweet>')
          .filter(Boolean)
          .map((tweet: string) => tweet.trim());
        
        formattedResponse += tweets.map((tweet: string) => {
          const lines = tweet.split('\n').filter(Boolean);
          return `Tweet:\n${lines.join('\n')}`;
        }).join('\n\n');
      } 
      // Handle web search formatting
      else if (result.name === 'web_search') {
        const searchResults = result.content.split('\n\n');
        formattedResponse += searchResults.map((result: string) => {
          return result.replace(/Position: \d+\n/, '');
        }).join('\n\n');
      }
      // Default formatting for other tools
      else {
        formattedResponse += result.content + '\n\n';
      }
    }
  }
  
  return formattedResponse.trim();
}

export async function POST(request: Request) {
  try {
    const { content, chatId } = await request.json();
    
    // Get available tools
    const tools = await toolhouse.getTools() as OpenAI.Chat.Completions.ChatCompletionTool[];
    
    // Initial message to determine tool usage
    const initialMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
      role: "user",
      content
    }];

    // Get initial completion to determine which tools to use
    const chatCompletion = await openai.chat.completions.create({
      messages: initialMessages,
      model: MODEL,
      tools,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Execute tools based on the completion
    const toolhouseMessages = await toolhouse.runTools(chatCompletion);
    
    // Format the tool responses
    const formattedToolResponse = formatToolResponse(toolhouseMessages as any[]);
    
    // Get final completion with tool results
    const finalMessages = [
      ...initialMessages,
      ...toolhouseMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[]
    ];

    const finalCompletion = await openai.chat.completions.create({
      messages: finalMessages,
      model: MODEL,
      tools,
      temperature: 0.7,
      max_tokens: 1000
    });

    // Prepare the final response
    const response = {
      message: formattedToolResponse || finalCompletion.choices[0]?.message?.content || "I couldn't generate a response.",
      chatId,
      timestamp: new Date().toISOString(),
      debug: {
        initialMessage: content,
        availableTools: tools.map(t => t.function.name),
        toolResults: toolhouseMessages,
        finalCompletion: finalCompletion.choices[0]?.message
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}