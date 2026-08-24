import { Test } from '@nestjs/testing';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { FakeStreamingChatModel } from '@langchain/core/utils/testing';
import { AgentService } from './agent.service';
import { CHAT_MODEL } from './agent.types';
import { toLangChainMessages } from './chat.graph';
import { SYSTEM_PROMPT } from './prompts';

const createService = async (responses: AIMessage[]) => {
  const app = await Test.createTestingModule({
    providers: [
      AgentService,
      {
        provide: CHAT_MODEL,
        useValue: new FakeStreamingChatModel({ responses }),
      },
    ],
  }).compile();

  return app.get(AgentService);
};

describe('AgentService', () => {
  it('returns the reply text', async () => {
    const service = await createService([new AIMessage('hi there')]);

    await expect(
      service.invoke([{ role: 'user', content: 'hello' }]),
    ).resolves.toBe('hi there');
  });

  it('streams the reply in chunks', async () => {
    const service = await createService([new AIMessage('hello world')]);

    const tokens: string[] = [];
    for await (const token of service.stream([
      { role: 'user', content: 'hi' },
    ])) {
      tokens.push(token);
    }

    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens.join('')).toBe('hello world');
  });
});

describe('toLangChainMessages', () => {
  it('prepends the system prompt and maps every role', () => {
    const mapped = toLangChainMessages([
      { role: 'user', content: 'oi' },
      { role: 'assistant', content: 'ola' },
      { role: 'system', content: 'be brief' },
    ]);

    expect(mapped).toHaveLength(4);
    expect(mapped[0]).toBeInstanceOf(SystemMessage);
    expect(mapped[0].text).toBe(SYSTEM_PROMPT);
    expect(mapped[1]).toBeInstanceOf(HumanMessage);
    expect(mapped[2]).toBeInstanceOf(AIMessage);
    expect(mapped[3]).toBeInstanceOf(SystemMessage);
  });
});
