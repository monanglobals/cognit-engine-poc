import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import type { OpenAiConfig } from '../config/configuration';
import { AgentService } from './agent.service';
import { CHAT_MODEL } from './agent.types';

@Module({
  providers: [
    {
      provide: CHAT_MODEL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const openai = config.getOrThrow<OpenAiConfig>('openai');

        return new ChatOpenAI({
          model: openai.model,
          apiKey: openai.apiKey,
          // Required for token-level streaming: without it the graph's
          // "messages" stream mode has nothing to forward.
          streaming: true,
          temperature: 0.7,
          // Only set when OPENAI_BASE_URL is present, which is what points the
          // client at an OpenAI-compatible gateway instead of OpenAI.
          ...(openai.baseUrl
            ? { configuration: { baseURL: openai.baseUrl } }
            : {}),
        });
      },
    },
    AgentService,
  ],
  exports: [AgentService],
})
export class AgentModule {}
