import type { ChatRole } from '@cognit-engine-poc/shared';

/**
 * What the agent layer speaks. Plain data on purpose — mapping to and from
 * LangChain message classes never leaves this module, and nothing about HTTP,
 * WebSockets or TypeORM reaches in.
 */
export interface AgentMessage {
  role: ChatRole;
  content: string;
}

/** DI token for the chat model, so tests can hand the graph a fake. */
export const CHAT_MODEL = 'CHAT_MODEL';
