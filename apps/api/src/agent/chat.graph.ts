import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { END, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import type { AgentMessage } from './agent.types';
import { SYSTEM_PROMPT } from './prompts';

export interface ChatGraphState {
  messages: BaseMessage[];
}

/**
 * The slice of the compiled graph the app actually uses. Spelling it out keeps
 * LangGraph's deeply generic types out of our public signatures — declaration
 * emit cannot name them — and documents the seam a fake would have to fill.
 */
export interface ChatGraph {
  invoke(input: ChatGraphState): Promise<ChatGraphState>;
  stream(
    input: ChatGraphState,
    options: { streamMode: 'messages' },
  ): Promise<AsyncIterable<[BaseMessage, unknown]>>;
}

/**
 * START → model → END.
 *
 * Compiled without a checkpointer on purpose: Postgres is the source of truth
 * for a conversation, so the caller loads the history and passes it in. The
 * graph itself stays stateless, which is also what makes it trivial to test.
 */
export function buildChatGraph(model: BaseChatModel): ChatGraph {
  return new StateGraph(MessagesAnnotation)
    .addNode('model', async (state) => ({
      messages: [await model.invoke(state.messages)],
    }))
    .addEdge(START, 'model')
    .addEdge('model', END)
    .compile();
}

/** The system prompt is prepended here, not stored with the conversation. */
export function toLangChainMessages(history: AgentMessage[]): BaseMessage[] {
  return [
    new SystemMessage(SYSTEM_PROMPT),
    ...history.map((message) => {
      switch (message.role) {
        case 'assistant':
          return new AIMessage(message.content);
        case 'system':
          return new SystemMessage(message.content);
        default:
          return new HumanMessage(message.content);
      }
    }),
  ];
}
