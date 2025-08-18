import { NestFactory } from '@nestjs/core'
import { IotModule } from './iot.module'

async function bootstrap() {
  const app = await NestFactory.create(IotModule)
  await app.listen(process.env.port ?? 3000)
}
bootstrap()
