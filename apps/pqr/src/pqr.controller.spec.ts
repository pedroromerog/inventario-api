import { Test, TestingModule } from '@nestjs/testing';
import { PqrController } from './pqr.controller';
import { PqrService } from './pqr.service';

describe('PqrController', () => {
  let pqrController: PqrController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PqrController],
      providers: [PqrService],
    }).compile();

    pqrController = app.get<PqrController>(PqrController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pqrController.getHello()).toBe('Hello World!');
    });
  });
});
