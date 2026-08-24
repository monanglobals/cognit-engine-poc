import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseHealthIndicator } from '../database/database.health';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;
  const database = { check: jest.fn().mockResolvedValue('ok') };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: DatabaseHealthIndicator, useValue: database },
      ],
    }).compile();
  });

  describe('getData', () => {
    it('should greet with the app name', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({
        message: 'Hello from cognit-engine-poc API',
      });
    });
  });

  describe('getHealth', () => {
    it('should report the api as healthy', async () => {
      const appController = app.get<AppController>(AppController);
      await expect(appController.getHealth()).resolves.toEqual({
        service: 'api',
        status: 'ok',
        dependencies: { database: 'ok' },
      });
    });
  });
});
