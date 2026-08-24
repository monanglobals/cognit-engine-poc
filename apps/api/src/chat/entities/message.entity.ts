import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { ChatRole } from '@cognit-engine-poc/shared';
import { Conversation } from './conversation.entity';

@Entity('messages')
// Every read is "the messages of one conversation, in order".
@Index(['conversationId', 'seq'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Insertion order, and what history is actually sorted by. `created_at`
   * cannot do this job: it defaults to now(), which is the *transaction*
   * timestamp, so two messages written in one transaction get identical
   * timestamps and then sort arbitrarily.
   *
   * bigint, so pg hands it back as a string — it never leaves the repository.
   */
  @Column({ type: 'bigint' })
  @Generated('increment')
  seq!: string;

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
