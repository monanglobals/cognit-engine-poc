import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';

/**
 * Everything the app does to `conversations`. No other layer touches TypeORM.
 */
@Injectable()
export class ConversationRepository {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversations: Repository<Conversation>,
  ) {}

  create(title: string | null = null): Promise<Conversation> {
    return this.conversations.save(this.conversations.create({ title }));
  }

  findById(id: string): Promise<Conversation | null> {
    return this.conversations.findOneBy({ id });
  }

  /** Marks the conversation as active without changing anything else. */
  async touch(id: string): Promise<void> {
    await this.conversations.update({ id }, { updatedAt: new Date() });
  }
}
