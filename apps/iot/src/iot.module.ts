import { Module } from '@nestjs/common'
import { IotController } from './iot.controller'
import { IotService } from './iot.service'
import { DemoModule } from './demo/demo.module'
import { Demo2Module } from './demo2/demo2.module'

@Module({
  imports: [DemoModule, Demo2Module],
  controllers: [IotController],
  providers: [IotService],
})
export class IotModule {}
