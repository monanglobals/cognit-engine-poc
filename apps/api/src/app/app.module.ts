import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '../config/configuration';
import { validateEnv } from '../config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // Lets .env reference variables already exported by the shell,
      // e.g. OPENAI_API_KEY=${CORE_API_OPENAI_API_KEY}
      expandVariables: true,
      envFilePath: ['.env'],
      validate: validateEnv,
      load: [appConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
