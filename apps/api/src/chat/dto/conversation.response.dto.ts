import type { ChatConversation } from '@cognit-engine-poc/shared';
import { Conversation } from '../entities/conversation.entity';

export class ConversationResponseDto implements ChatConversation {
  id!: string;
  title!: string | null;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(conversation: Conversation): ConversationResponseDto {
    return {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    };
  }
}
