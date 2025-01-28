// src/lib/toolhouse.ts
import { Toolhouse } from '@toolhouseai/sdk';

if (!process.env.TOOLHOUSE_API_KEY) {
  throw new Error('Missing TOOLHOUSE_API_KEY environment variable');
}

export const toolhouse = new Toolhouse({
  apiKey: process.env.TOOLHOUSE_API_KEY,
  metadata: {
    id: "assistant",
    timezone: "0"
  }
});

export const getTools = async () => {
  return await toolhouse.getTools();
};