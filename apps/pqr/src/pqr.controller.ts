import { Controller, Get } from '@nestjs/common';
import { PqrService } from './pqr.service';

@Controller()
export class PqrController {
  constructor(private readonly pqrService: PqrService) {}

  @Get()
  getHello(): string {
    return this.pqrService.getHello();
  }
}
