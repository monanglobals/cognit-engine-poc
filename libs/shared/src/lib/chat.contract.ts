/**
 * Vocabulary shared between the API and any client. Kept here so the Next.js
 * app can import the same names instead of restating them.
 */
export type ChatRole = 'system' | 'user' | 'assistant';

/** Dates cross the wire as ISO 8601 strings. */
export interface ChatConversation {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}
