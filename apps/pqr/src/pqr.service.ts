import { Injectable } from '@nestjs/common';

@Injectable()
export class PqrService {
  getHello(): string {
    return 'Hello World!';
  }
}
