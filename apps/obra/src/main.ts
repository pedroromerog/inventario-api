import { NestFactory } from '@nestjs/core'
import { ObraModule } from './obra.module'

async function bootstrap() {
  const app = await NestFactory.create(ObraModule)
  await app.listen(process.env.port ?? 3000)
}
bootstrap()
