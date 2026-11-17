import { createUIMessageStreamResponse, toUIMessageStream, type UIMessage } from 'ai';
import { runAgent } from '@/lib/agent';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = await runAgent(messages);
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
