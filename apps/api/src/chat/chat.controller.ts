import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ConversationResponseDto } from './dto/conversation.response.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { HistoryQueryDto } from './dto/history-query.dto';
import { MessageResponseDto } from './dto/message.response.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  createConversation(
    @Body() dto: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    return this.chatService.createConversation(dto);
  }

  @Get('conversations/:id/messages')
  getMessages(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: HistoryQueryDto,
  ): Promise<MessageResponseDto[]> {
    return this.chatService.getHistory(id, query.limit);
  }
}
