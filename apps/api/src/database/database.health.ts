import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { ServiceStatus } from '@cognit-engine-poc/shared';

/**
 * The only place outside the repositories that talks to the DataSource — the
 * health endpoint needs a liveness probe, not domain data.
 */
@Injectable()
export class DatabaseHealthIndicator {
  private readonly logger = new Logger(DatabaseHealthIndicator.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async check(): Promise<ServiceStatus> {
    try {
      await this.dataSource.query('SELECT 1');
      return 'ok';
    } catch (error) {
      this.logger.warn(
        `Database unreachable: ${error instanceof Error ? error.message : error}`,
      );
      return 'down';
    }
  }
}
