import { Injectable } from '@nestjs/common'

@Injectable()
export class IotService {
  getHello(): string {
    return 'Hello World!'
  }
}
