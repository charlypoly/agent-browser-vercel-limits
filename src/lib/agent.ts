import { streamText, convertToModelMessages, isStepCount, type UIMessage } from 'ai';
import { tools } from './tools';
import { browserTools } from './tools/browser';

export const MODEL = process.env.AI_MODEL ?? 'anthropic/claude-sonnet-5.5';

const SYSTEM_PROMPT = `You are a helpful assistant that completes tasks for the user.
You can browse websites with the browser tools: open pages, click, fill forms and read content.
Use the available tools when they help. Be concise.`;

export async function runAgent(messages: UIMessage[]) {
  return streamText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { ...tools, ...browserTools },
    stopWhen: isStepCount(20),
  });
}
