import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Categoria } from './entities/categoria.entity'
import { CategoriasController } from './categorias.controller'
import { CategoriasService } from './categorias.service'
import { CategoriasRepository } from './repository/categorias.repository'
import { CreateCategoriaAction } from './use-case/create-categoria.usecase'
import { GetCategoriaAction } from './use-case/get-categoria.usecase'
import { UpdateCategoriaAction } from './use-case/update-categoria.usecase'
import { DeleteCategoriaAction } from './use-case/delete-categoria.usecase'

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoriasController],
  providers: [
    CategoriasService,
    CategoriasRepository,
    CreateCategoriaAction,
    GetCategoriaAction,
    UpdateCategoriaAction,
    DeleteCategoriaAction,
  ],
  exports: [CategoriasService, CategoriasRepository],
})
export class CategoriasModule {}
