import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { DEFAULT_HISTORY_LIMIT, MessageRepository } from './message.repository';

describe('MessageRepository', () => {
  const typeorm = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  let repository: MessageRepository;

  beforeEach(async () => {
    jest.resetAllMocks();

    const app = await Test.createTestingModule({
      providers: [
        MessageRepository,
        { provide: getRepositoryToken(Message), useValue: typeorm },
      ],
    }).compile();

    repository = app.get(MessageRepository);
  });

  it('appends a message', async () => {
    const message = { conversationId: 'c1', role: 'user' as const, content: 'hi' };
    typeorm.create.mockReturnValue(message);
    typeorm.save.mockResolvedValue({ id: 'm1', ...message });

    await expect(repository.append(message)).resolves.toEqual({
      id: 'm1',
      ...message,
    });
    expect(typeorm.create).toHaveBeenCalledWith(message);
  });

  it('reads the tail of the conversation and hands it back oldest first', async () => {
    typeorm.find.mockResolvedValue([{ id: 'newest' }, { id: 'oldest' }]);

    await expect(repository.findByConversation('c1')).resolves.toEqual([
      { id: 'oldest' },
      { id: 'newest' },
    ]);

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { conversationId: 'c1' },
      order: { createdAt: 'DESC' },
      take: DEFAULT_HISTORY_LIMIT,
    });
  });

  it('honours an explicit limit', async () => {
    typeorm.find.mockResolvedValue([]);

    await repository.findByConversation('c1', 5);

    expect(typeorm.find).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 }),
    );
  });
});
