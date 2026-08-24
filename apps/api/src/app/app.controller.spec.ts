import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
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
    it('should report the api as healthy', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHealth()).toEqual({
        service: 'api',
        status: 'ok',
      });
    });
  });
});
