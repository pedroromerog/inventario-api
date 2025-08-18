import { Injectable } from '@nestjs/common'
import { CreateProductoAction } from './use-case/create-producto.usecase'
import { GetProductoAction } from './use-case/get-producto.usecase'
import { UpdateProductoAction } from './use-case/update-producto.usecase'
import { DeleteProductoAction } from './use-case/delete-producto.usecase'
import { ProductosRepository } from './repository/productos.repository'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'
import { Producto } from './entities/producto.entity'
import { TipoProducto, EstadoProducto } from './enums/producto.enums'

@Injectable()
export class ProductosService {
  constructor(
    private readonly createProductoAction: CreateProductoAction,
    private readonly getProductoAction: GetProductoAction,
    private readonly updateProductoAction: UpdateProductoAction,
    private readonly deleteProductoAction: DeleteProductoAction,
    private readonly productosRepository: ProductosRepository,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    return this.createProductoAction.execute(createProductoDto)
  }

  async findAll(): Promise<Producto[]> {
    return this.getProductoAction.findAll()
  }

  async findOne(id: number): Promise<Producto> {
    return this.getProductoAction.findById(id)
  }

  async findByCodigo(codigo: string): Promise<Producto> {
    return this.getProductoAction.findByCodigo(codigo)
  }

  async findByTipo(tipo: TipoProducto): Promise<Producto[]> {
    return this.getProductoAction.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoProducto): Promise<Producto[]> {
    return this.getProductoAction.findByEstado(estado)
  }

  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    return this.getProductoAction.findByCategoria(categoriaId)
  }

  async findByProveedor(proveedorId: number): Promise<Producto[]> {
    return this.getProductoAction.findByProveedor(proveedorId)
  }

  async findByMarca(marca: string): Promise<Producto[]> {
    return this.getProductoAction.findByMarca(marca)
  }

  async findLowStock(): Promise<Producto[]> {
    return this.getProductoAction.findLowStock()
  }

  async findOutOfStock(): Promise<Producto[]> {
    return this.getProductoAction.findOutOfStock()
  }

  async searchByTerm(term: string): Promise<Producto[]> {
    return this.getProductoAction.searchByTerm(term)
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    return this.updateProductoAction.execute(id, updateProductoDto)
  }

  async remove(id: number): Promise<void> {
    return this.deleteProductoAction.execute(id)
  }

  async restore(id: number): Promise<void> {
    return this.deleteProductoAction.restore(id)
  }

  async hardRemove(id: number): Promise<void> {
    return this.deleteProductoAction.hardDelete(id)
  }

  async updateStock(
    id: number,
    stockActual: number,
    stockReservado: number,
  ): Promise<void> {
    return this.productosRepository.updateStock(id, stockActual, stockReservado)
  }
}
