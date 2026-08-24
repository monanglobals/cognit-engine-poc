import type { ChatMessage, ChatRole } from '@cognit-engine-poc/shared';
import { Message } from '../entities/message.entity';

export class MessageResponseDto implements ChatMessage {
  id!: string;
  conversationId!: string;
  role!: ChatRole;
  content!: string;
  createdAt!: string;

  static fromEntity(message: Message): MessageResponseDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    };
  }
}
