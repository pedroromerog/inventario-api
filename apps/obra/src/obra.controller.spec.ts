import { Test, TestingModule } from '@nestjs/testing'
import { ObraController } from './obra.controller'
import { ObraService } from './obra.service'

describe('ObraController', () => {
  let obraController: ObraController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ObraController],
      providers: [ObraService],
    }).compile()

    obraController = app.get<ObraController>(ObraController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(obraController.getHello()).toBe('Hello World!')
    })
  })
})
