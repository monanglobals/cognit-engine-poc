import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ChatRole } from '@cognit-engine-poc/shared';
import { Message } from '../entities/message.entity';

export interface NewMessage {
  conversationId: string;
  role: ChatRole;
  content: string;
}

/** How many messages a conversation hands back by default. */
export const DEFAULT_HISTORY_LIMIT = 50;

/**
 * Everything the app does to `messages`. No other layer touches TypeORM.
 */
@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messages: Repository<Message>,
  ) {}

  append(message: NewMessage): Promise<Message> {
    return this.messages.save(this.messages.create(message));
  }

  /**
   * The most recent `limit` messages, oldest first — the order a model expects
   * to read them in. Fetching descending and reversing keeps the tail of a long
   * conversation rather than its beginning.
   *
   * Ordered by `seq`, not `created_at`: see the note on Message.seq.
   */
  async findByConversation(
    conversationId: string,
    limit: number = DEFAULT_HISTORY_LIMIT,
  ): Promise<Message[]> {
    const messages = await this.messages.find({
      where: { conversationId },
      order: { seq: 'DESC' },
      take: limit,
    });

    return messages.reverse();
  }
}
