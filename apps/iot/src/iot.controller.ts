import { Controller, Get } from '@nestjs/common'
import { IotService } from './iot.service'

@Controller()
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Get()
  getHello(): string {
    return this.iotService.getHello()
  }
}
