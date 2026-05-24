import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is required in .env.local');
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Using a real valid model to ensure API succeeds
export const CLAUDE_MODEL = 'claude-3-7-sonnet-20250219';

export const PRICING = {
  input: 3,    // $3 per 1M input tokens
  output: 15,  // $15 per 1M output tokens
};

export function calculateCost(inputTokens: number, outputTokens: number): number {
  return (inputTokens * PRICING.input + outputTokens * PRICING.output) / 1_000_000;
}
