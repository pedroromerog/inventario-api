import { Controller, Get } from '@nestjs/common'
import { ObraService } from './obra.service'

@Controller()
export class ObraController {
  constructor(private readonly obraService: ObraService) {}

  @Get()
  getHello(): string {
    return this.obraService.getHello()
  }
}
