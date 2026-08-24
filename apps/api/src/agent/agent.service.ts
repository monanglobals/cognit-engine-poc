import { Inject, Injectable } from '@nestjs/common';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { CHAT_MODEL, type AgentMessage } from './agent.types';
import { buildChatGraph, toLangChainMessages, type ChatGraph } from './chat.graph';

/**
 * The only door into the LangGraph agent. Takes and returns plain data, so
 * callers never touch LangChain types.
 */
@Injectable()
export class AgentService {
  private readonly graph: ChatGraph;

  constructor(@Inject(CHAT_MODEL) model: BaseChatModel) {
    this.graph = buildChatGraph(model);
  }

  /** Runs the graph to completion and returns the reply as text. */
  async invoke(history: AgentMessage[]): Promise<string> {
    const result = await this.graph.invoke({
      messages: toLangChainMessages(history),
    });

    const reply = result.messages.at(-1);

    if (!reply) {
      throw new Error('The agent produced no reply');
    }

    return reply.text;
  }

  /**
   * Yields the reply token by token as the model produces it. Callers are free
   * to ignore this and use `invoke` — the graph is the same either way.
   */
  async *stream(history: AgentMessage[]): AsyncGenerator<string> {
    const stream = await this.graph.stream(
      { messages: toLangChainMessages(history) },
      { streamMode: 'messages' },
    );

    for await (const [chunk] of stream) {
      const token = chunk.text;

      if (token) {
        yield token;
      }
    }
  }
}
