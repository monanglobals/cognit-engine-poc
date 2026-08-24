import { Injectable } from '@nestjs/common';
import { APP_NAME, HealthCheck, healthCheck } from '@cognit-engine-poc/shared';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: `Hello from ${APP_NAME} API` };
  }

  getHealth(): HealthCheck {
    return healthCheck('api');
  }
}
