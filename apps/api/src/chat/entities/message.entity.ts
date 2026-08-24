import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { ChatRole } from '@cognit-engine-poc/shared';
import { Conversation } from './conversation.entity';

@Entity('messages')
// Every read is "the messages of one conversation, in order".
@Index(['conversationId', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'conversation_id', type: 'uuid' })
  conversationId!: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation!: Conversation;

  /**
   * Plain text rather than a Postgres enum: the set of roles is still moving
   * (tool messages will show up), and altering an enum type is a migration for
   * something the TypeScript type and the DTOs already constrain.
   */
  @Column({ type: 'text' })
  role!: ChatRole;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
