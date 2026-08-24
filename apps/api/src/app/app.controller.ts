import { Controller, Get } from '@nestjs/common';
import type { HealthCheck } from '@cognit-engine-poc/shared';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('health')
  getHealth(): Promise<HealthCheck> {
    return this.appService.getHealth();
  }
}
