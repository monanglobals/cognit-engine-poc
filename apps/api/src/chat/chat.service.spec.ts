import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';

const CREATED_AT = new Date('2026-08-24T12:00:00.000Z');

const conversationEntity = (overrides: Partial<Conversation> = {}) =>
  ({
    id: '11111111-1111-4111-8111-111111111111',
    title: null,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    messages: [],
    ...overrides,
  }) as Conversation;

const messageEntity = (overrides: Partial<Message> = {}) =>
  ({
    id: '22222222-2222-4222-8222-222222222222',
    conversationId: '11111111-1111-4111-8111-111111111111',
    role: 'user',
    content: 'hello',
    createdAt: CREATED_AT,
    ...overrides,
  }) as Message;

describe('ChatService', () => {
  const conversations = {
    create: jest.fn(),
    findById: jest.fn(),
    touch: jest.fn(),
  };
  const messages = { append: jest.fn(), findByConversation: jest.fn() };

  let service: ChatService;

  beforeEach(async () => {
    jest.resetAllMocks();

    const app = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: ConversationRepository, useValue: conversations },
        { provide: MessageRepository, useValue: messages },
      ],
    }).compile();

    service = app.get(ChatService);
  });

  describe('createConversation', () => {
    it('creates a titleless conversation and serialises dates as ISO', async () => {
      conversations.create.mockResolvedValue(conversationEntity());

      await expect(service.createConversation({})).resolves.toEqual({
        id: '11111111-1111-4111-8111-111111111111',
        title: null,
        createdAt: '2026-08-24T12:00:00.000Z',
        updatedAt: '2026-08-24T12:00:00.000Z',
      });
      expect(conversations.create).toHaveBeenCalledWith(null);
    });

    it('passes the title through', async () => {
      conversations.create.mockResolvedValue(
        conversationEntity({ title: 'support' }),
      );

      await expect(
        service.createConversation({ title: 'support' }),
      ).resolves.toMatchObject({ title: 'support' });
      expect(conversations.create).toHaveBeenCalledWith('support');
    });
  });

  describe('getHistory', () => {
    it('returns the conversation messages', async () => {
      conversations.findById.mockResolvedValue(conversationEntity());
      messages.findByConversation.mockResolvedValue([messageEntity()]);

      await expect(
        service.getHistory('11111111-1111-4111-8111-111111111111'),
      ).resolves.toEqual([
        {
          id: '22222222-2222-4222-8222-222222222222',
          conversationId: '11111111-1111-4111-8111-111111111111',
          role: 'user',
          content: 'hello',
          createdAt: '2026-08-24T12:00:00.000Z',
        },
      ]);
    });

    it('forwards the limit to the repository', async () => {
      conversations.findById.mockResolvedValue(conversationEntity());
      messages.findByConversation.mockResolvedValue([]);

      await service.getHistory('11111111-1111-4111-8111-111111111111', 5);

      expect(messages.findByConversation).toHaveBeenCalledWith(
        '11111111-1111-4111-8111-111111111111',
        5,
      );
    });

    it('is a 404 for an unknown conversation, not an empty history', async () => {
      conversations.findById.mockResolvedValue(null);

      await expect(service.getHistory('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(messages.findByConversation).not.toHaveBeenCalled();
    });
  });
});
