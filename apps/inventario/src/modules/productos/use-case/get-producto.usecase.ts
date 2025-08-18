import { Injectable, NotFoundException } from '@nestjs/common'
import { ProductosRepository } from '../repository/productos.repository'
import { Producto } from '../entities/producto.entity'
import { TipoProducto, EstadoProducto } from '../enums/producto.enums'

@Injectable()
export class GetProductoAction {
  constructor(private readonly productosRepository: ProductosRepository) {}

  async findById(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findById(id)
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    }
    return producto
  }

  async findByCodigo(codigo: string): Promise<Producto> {
    const producto = await this.productosRepository.findByCodigo(codigo)
    if (!producto) {
      throw new NotFoundException(`Producto con código ${codigo} no encontrado`)
    }
    return producto
  }

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.findActive()
  }

  async findByTipo(tipo: TipoProducto): Promise<Producto[]> {
    return this.productosRepository.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoProducto): Promise<Producto[]> {
    return this.productosRepository.findByEstado(estado)
  }

  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    return this.productosRepository.findByCategoria(categoriaId)
  }

  async findByProveedor(proveedorId: number): Promise<Producto[]> {
    return this.productosRepository.findByProveedor(proveedorId)
  }

  async findByMarca(marca: string): Promise<Producto[]> {
    return this.productosRepository.findByMarca(marca)
  }

  async findLowStock(): Promise<Producto[]> {
    return this.productosRepository.findLowStock()
  }

  async findOutOfStock(): Promise<Producto[]> {
    return this.productosRepository.findOutOfStock()
  }

  async searchByTerm(term: string): Promise<Producto[]> {
    return this.productosRepository.searchByTerm(term)
  }
}
