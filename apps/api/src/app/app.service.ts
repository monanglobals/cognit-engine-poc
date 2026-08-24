import { Injectable } from '@nestjs/common';
import { APP_NAME, HealthCheck, healthCheck } from '@cognit-engine-poc/shared';
import { DatabaseHealthIndicator } from '../database/database.health';

@Injectable()
export class AppService {
  constructor(private readonly database: DatabaseHealthIndicator) {}

  getData(): { message: string } {
    return { message: `Hello from ${APP_NAME} API` };
  }

  async getHealth(): Promise<HealthCheck> {
    return healthCheck('api', { database: await this.database.check() });
  }
}
