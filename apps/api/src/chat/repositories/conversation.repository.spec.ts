import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { ConversationRepository } from './conversation.repository';

describe('ConversationRepository', () => {
  const typeorm = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  let repository: ConversationRepository;

  beforeEach(async () => {
    jest.resetAllMocks();

    const app = await Test.createTestingModule({
      providers: [
        ConversationRepository,
        { provide: getRepositoryToken(Conversation), useValue: typeorm },
      ],
    }).compile();

    repository = app.get(ConversationRepository);
  });

  it('creates a conversation without a title by default', async () => {
    const created = { title: null };
    const saved = { id: 'c1', title: null };
    typeorm.create.mockReturnValue(created);
    typeorm.save.mockResolvedValue(saved);

    await expect(repository.create()).resolves.toBe(saved);
    expect(typeorm.create).toHaveBeenCalledWith({ title: null });
    expect(typeorm.save).toHaveBeenCalledWith(created);
  });

  it('creates a conversation with the given title', async () => {
    typeorm.create.mockReturnValue({});
    typeorm.save.mockResolvedValue({});

    await repository.create('support');

    expect(typeorm.create).toHaveBeenCalledWith({ title: 'support' });
  });

  it('returns null when the conversation does not exist', async () => {
    typeorm.findOneBy.mockResolvedValue(null);

    await expect(repository.findById('missing')).resolves.toBeNull();
    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: 'missing' });
  });

  it('touches a conversation by bumping updatedAt', async () => {
    typeorm.update.mockResolvedValue({ affected: 1 });

    await repository.touch('c1');

    expect(typeorm.update).toHaveBeenCalledWith(
      { id: 'c1' },
      { updatedAt: expect.any(Date) },
    );
  });
});
