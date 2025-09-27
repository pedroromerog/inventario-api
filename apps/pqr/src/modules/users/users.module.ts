import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Ciudadano } from './entities/ciudadano.entity'
import { Funcionario } from './entities/funcionario.entity'
import { Dependencia } from '../organigrama/entities/dependencia.entity'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ciudadano, Funcionario, Dependencia]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
