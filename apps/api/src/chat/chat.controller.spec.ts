import { Test } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

describe('ChatController', () => {
  const chatService = { createConversation: jest.fn(), getHistory: jest.fn() };

  let controller: ChatController;

  beforeEach(async () => {
    jest.resetAllMocks();

    const app = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [{ provide: ChatService, useValue: chatService }],
    }).compile();

    controller = app.get(ChatController);
  });

  it('delegates conversation creation to the service', async () => {
    chatService.createConversation.mockResolvedValue({ id: 'c1' });

    await expect(
      controller.createConversation({ title: 'support' }),
    ).resolves.toEqual({ id: 'c1' });
    expect(chatService.createConversation).toHaveBeenCalledWith({
      title: 'support',
    });
  });

  it('delegates history reads to the service, limit included', async () => {
    chatService.getHistory.mockResolvedValue([]);

    await controller.getMessages('c1', { limit: 10 });

    expect(chatService.getHistory).toHaveBeenCalledWith('c1', 10);
  });
});
