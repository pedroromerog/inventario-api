import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Stock } from '../entities/stock.entity'
import { EstadoStock } from '../enums/stock.enums'

@Injectable()
export class StockRepository extends Repository<Stock> {
  constructor(private dataSource: DataSource) {
    super(Stock, dataSource.createEntityManager())
  }

  async findById(id: number): Promise<Stock | null> {
    return this.findOne({
      where: { id, isActive: true },
      relations: ['producto', 'bodega'],
    })
  }

  async findByProductoAndBodega(
    productoId: number,
    bodegaId: number,
  ): Promise<Stock | null> {
    return this.findOne({
      where: { productoId, bodegaId, isActive: true },
      relations: ['producto', 'bodega'],
    })
  }

  async findByProducto(productoId: number): Promise<Stock[]> {
    return this.find({
      where: { productoId, isActive: true },
      relations: ['producto', 'bodega'],
      order: { bodegaId: 'ASC' },
    })
  }

  async findByBodega(bodegaId: number): Promise<Stock[]> {
    return this.find({
      where: { bodegaId, isActive: true },
      relations: ['producto', 'bodega'],
      order: { productoId: 'ASC' },
    })
  }

  async findActive(): Promise<Stock[]> {
    return this.find({
      where: { isActive: true },
      relations: ['producto', 'bodega'],
      order: { productoId: 'ASC', bodegaId: 'ASC' },
    })
  }

  async findByEstado(estado: EstadoStock): Promise<Stock[]> {
    return this.find({
      where: { estado, isActive: true },
      relations: ['producto', 'bodega'],
      order: { productoId: 'ASC', bodegaId: 'ASC' },
    })
  }

  async findLowStock(): Promise<Stock[]> {
    return this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.producto', 'producto')
      .leftJoinAndSelect('stock.bodega', 'bodega')
      .where('stock.isActive = :isActive', { isActive: true })
      .andWhere('stock.stockDisponible <= stock.stockMinimo')
      .orderBy('stock.productoId', 'ASC')
      .addOrderBy('stock.bodegaId', 'ASC')
      .getMany()
  }

  async findOutOfStock(): Promise<Stock[]> {
    return this.find({
      where: { stockDisponible: 0, isActive: true },
      relations: ['producto', 'bodega'],
      order: { productoId: 'ASC', bodegaId: 'ASC' },
    })
  }

  async findOverStock(): Promise<Stock[]> {
    return this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.producto', 'producto')
      .leftJoinAndSelect('stock.bodega', 'bodega')
      .where('stock.isActive = :isActive', { isActive: true })
      .andWhere('stock.stockActual > stock.stockMaximo')
      .orderBy('stock.productoId', 'ASC')
      .addOrderBy('stock.bodegaId', 'ASC')
      .getMany()
  }

  async searchByTerm(term: string): Promise<Stock[]> {
    return this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.producto', 'producto')
      .leftJoinAndSelect('stock.bodega', 'bodega')
      .where('stock.isActive = :isActive', { isActive: true })
      .andWhere(
        '(producto.nombre LIKE :term OR producto.codigo LIKE :term OR bodega.nombre LIKE :term OR bodega.codigo LIKE :term)',
        { term: `%${term}%` },
      )
      .orderBy('stock.productoId', 'ASC')
      .addOrderBy('stock.bodegaId', 'ASC')
      .getMany()
  }

  async createStock(data: Partial<Stock>): Promise<Stock> {
    const stock = this.create(data)
    return this.save(stock)
  }

  async updateStock(id: number, data: Partial<Stock>): Promise<Stock | null> {
    await this.update(id, data)
    return this.findById(id)
  }

  async updateStockByProductoAndBodega(
    productoId: number,
    bodegaId: number,
    data: Partial<Stock>,
  ): Promise<Stock | null> {
    await this.update({ productoId, bodegaId }, data)
    return this.findByProductoAndBodega(productoId, bodegaId)
  }

  async deleteStock(id: number): Promise<void> {
    await this.update(id, { isActive: false, deletedAt: new Date() })
  }

  async hardDeleteStock(id: number): Promise<void> {
    await this.delete(id)
  }

  async restoreStock(id: number): Promise<Stock | null> {
    await this.update(id, { isActive: true, deletedAt: undefined })
    return this.findById(id)
  }

  async updateStockQuantities(
    productoId: number,
    bodegaId: number,
    stockActual: number,
    stockReservado: number,
  ): Promise<void> {
    await this.update(
      { productoId, bodegaId },
      {
        stockActual,
        stockReservado,
        fechaUltimaActualizacion: new Date(),
      },
    )
  }

  async findStockSummary(): Promise<any[]> {
    return this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.producto', 'producto')
      .leftJoinAndSelect('stock.bodega', 'bodega')
      .select([
        'producto.id as productoId',
        'producto.nombre as productoNombre',
        'producto.codigo as productoCodigo',
        'bodega.id as bodegaId',
        'bodega.nombre as bodegaNombre',
        'bodega.codigo as bodegaCodigo',
        'SUM(stock.stockActual) as stockTotal',
        'SUM(stock.stockReservado) as stockReservadoTotal',
        'SUM(stock.stockDisponible) as stockDisponibleTotal',
      ])
      .where('stock.isActive = :isActive', { isActive: true })
      .groupBy('producto.id, bodega.id')
      .orderBy('producto.nombre', 'ASC')
      .addOrderBy('bodega.nombre', 'ASC')
      .getRawMany()
  }
}
