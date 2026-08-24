import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationResponseDto } from './dto/conversation.response.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { MessageResponseDto } from './dto/message.response.dto';
import { Conversation } from './entities/conversation.entity';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';

/**
 * Orchestrates the chat use cases. Reads and writes go through the
 * repositories; nothing here knows about HTTP or WebSockets.
 */
@Injectable()
export class ChatService {
  constructor(
    private readonly conversations: ConversationRepository,
    private readonly messages: MessageRepository,
  ) {}

  async createConversation(
    dto: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    const conversation = await this.conversations.create(dto.title ?? null);

    return ConversationResponseDto.fromEntity(conversation);
  }

  async getHistory(
    conversationId: string,
    limit?: number,
  ): Promise<MessageResponseDto[]> {
    await this.requireConversation(conversationId);

    const messages = await this.messages.findByConversation(
      conversationId,
      limit,
    );

    return messages.map(MessageResponseDto.fromEntity);
  }

  /** An unknown conversation is a 404, not an empty history. */
  private async requireConversation(id: string): Promise<Conversation> {
    const conversation = await this.conversations.findById(id);

    if (!conversation) {
      throw new NotFoundException(`Conversation ${id} not found`);
    }

    return conversation;
  }
}
