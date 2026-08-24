import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseHealthIndicator } from './database.health';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.getOrThrow<string>('databaseUrl'),
        // Entities register themselves through TypeOrmModule.forFeature(),
        // so feature modules stay the only place that knows about them.
        autoLoadEntities: true,
        // POC only: the schema is derived from the entities on boot. Replace
        // with migrations once it settles — never enable this in production.
        synchronize: !config.getOrThrow<boolean>('isProduction'),
        // Postgres 13+ ships gen_random_uuid() in core; picking pgcrypto here
        // keeps TypeORM off the uuid-ossp extension for generated uuid columns.
        uuidExtension: 'pgcrypto' as const,
        logging: ['error', 'warn'] as const,
      }),
    }),
  ],
  providers: [DatabaseHealthIndicator],
  exports: [DatabaseHealthIndicator],
})
export class DatabaseModule {}
