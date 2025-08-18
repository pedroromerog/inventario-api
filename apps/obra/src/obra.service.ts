import { Injectable } from '@nestjs/common'

@Injectable()
export class ObraService {
  getHello(): string {
    return 'Hello World!'
  }
}
