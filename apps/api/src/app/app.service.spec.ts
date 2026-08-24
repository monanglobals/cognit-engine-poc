import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should greet with the app name', () => {
      expect(service.getData()).toEqual({
        message: 'Hello from cognit-engine-poc API',
      });
    });
  });

  describe('getHealth', () => {
    it('should report the api as healthy', () => {
      expect(service.getHealth()).toEqual({ service: 'api', status: 'ok' });
    });
  });
});
