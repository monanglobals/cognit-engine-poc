import { Test } from '@nestjs/testing';
import { DatabaseHealthIndicator } from '../database/database.health';
import { AppService } from './app.service';

describe('AppService', () => {
  const database = { check: jest.fn() };

  const createService = async () => {
    const app = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: DatabaseHealthIndicator, useValue: database },
      ],
    }).compile();

    return app.get<AppService>(AppService);
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getData', () => {
    it('should greet with the app name', async () => {
      const service = await createService();
      expect(service.getData()).toEqual({
        message: 'Hello from cognit-engine-poc API',
      });
    });
  });

  describe('getHealth', () => {
    it('reports the api as healthy when the database answers', async () => {
      database.check.mockResolvedValue('ok');
      const service = await createService();

      await expect(service.getHealth()).resolves.toEqual({
        service: 'api',
        status: 'ok',
        dependencies: { database: 'ok' },
      });
    });

    it('degrades when the database is unreachable', async () => {
      database.check.mockResolvedValue('down');
      const service = await createService();

      await expect(service.getHealth()).resolves.toEqual({
        service: 'api',
        status: 'degraded',
        dependencies: { database: 'down' },
      });
    });
  });
});
