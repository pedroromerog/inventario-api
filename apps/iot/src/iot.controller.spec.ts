import { Test, TestingModule } from '@nestjs/testing'
import { IotController } from './iot.controller'
import { IotService } from './iot.service'

describe('IotController', () => {
  let iotController: IotController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IotController],
      providers: [IotService],
    }).compile()

    iotController = app.get<IotController>(IotController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(iotController.getHello()).toBe('Hello World!')
    })
  })
})
