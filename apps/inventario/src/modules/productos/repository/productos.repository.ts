import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Producto } from '../entities/producto.entity'
import { TipoProducto, EstadoProducto } from '../enums/producto.enums'

@Injectable()
export class ProductosRepository extends Repository<Producto> {
  constructor(private dataSource: DataSource) {
    super(Producto, dataSource.createEntityManager())
  }

  async findById(id: number): Promise<Producto | null> {
    return this.findOne({
      where: { id, isActive: true },
    })
  }

  async findByCodigo(codigo: string): Promise<Producto | null> {
    return this.findOne({
      where: { codigo, isActive: true },
    })
  }

  async findActive(): Promise<Producto[]> {
    return this.find({
      where: { isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByTipo(tipo: TipoProducto): Promise<Producto[]> {
    return this.find({
      where: { tipo, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByEstado(estado: EstadoProducto): Promise<Producto[]> {
    return this.find({
      where: { estado, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    return this.find({
      where: { categoriaId, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByProveedor(proveedorId: number): Promise<Producto[]> {
    return this.find({
      where: { proveedorId, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByMarca(marca: string): Promise<Producto[]> {
    return this.find({
      where: { marca, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findLowStock(): Promise<Producto[]> {
    // Este método se implementará cuando se tenga la relación con Stock
    return this.find({
      where: { isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findOutOfStock(): Promise<Producto[]> {
    // Este método se implementará cuando se tenga la relación con Stock
    return this.find({
      where: { isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async searchByTerm(term: string): Promise<Producto[]> {
    return this.createQueryBuilder('producto')
      .where('producto.isActive = :isActive', { isActive: true })
      .andWhere(
        '(producto.nombre LIKE :term OR producto.codigo LIKE :term OR producto.descripcion LIKE :term OR producto.marca LIKE :term OR producto.modelo LIKE :term)',
        { term: `%${term}%` },
      )
      .orderBy('producto.nombre', 'ASC')
      .getMany()
  }

  async createProducto(data: Partial<Producto>): Promise<Producto> {
    const producto = this.create(data)
    return this.save(producto)
  }

  async updateProducto(
    id: number,
    data: Partial<Producto>,
  ): Promise<Producto | null> {
    await this.update(id, data)
    return this.findById(id)
  }

  async deleteProducto(id: number): Promise<void> {
    await this.update(id, { isActive: false, deletedAt: new Date() })
  }

  async hardDeleteProducto(id: number): Promise<void> {
    await this.delete(id)
  }

  async restoreProducto(id: number): Promise<Producto | null> {
    await this.update(id, { isActive: true, deletedAt: undefined })
    return this.findById(id)
  }

  async updateStock(
    id: number,
    stockActual: number,
    stockReservado: number,
  ): Promise<void> {
    // Este método se implementará cuando se tenga la relación con Stock
    // Por ahora solo actualizamos el producto
    await this.update(id, {})
  }
}
