import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Producto } from './entities/producto.entity'
import { ProductosController } from './productos.controller'
import { ProductosService } from './productos.service'
import { ProductosRepository } from './repository/productos.repository'
import { CreateProductoAction } from './use-case/create-producto.usecase'
import { GetProductoAction } from './use-case/get-producto.usecase'
import { UpdateProductoAction } from './use-case/update-producto.usecase'
import { DeleteProductoAction } from './use-case/delete-producto.usecase'

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  controllers: [ProductosController],
  providers: [
    ProductosService,
    ProductosRepository,
    CreateProductoAction,
    GetProductoAction,
    UpdateProductoAction,
    DeleteProductoAction,
  ],
  exports: [ProductosService, ProductosRepository],
})
export class ProductosModule {}
