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

  /**
   * Inserta o actualiza (upsert) una fila de stock sumando cantidad.
   * - Si no existe, crea el registro activo
   * - Si existe (incluido soft-deleted), incrementa stock y reactiva
   * - Actualiza precioUltimo y calcula precioPromedio ponderado cuando hay precio
   */
  async addOrCreateStock(
    productoId: number,
    bodegaId: number,
    cantidad: number,
    precioUnitario?: number,
  ): Promise<void> {
    // Usamos SQL nativo para aprovechar ON CONFLICT y cálculos atómicos
    const params = [
      productoId,
      bodegaId,
      cantidad,
      // precioUltimo (puede ser null)
      precioUnitario ?? null,
    ]

    // Nota: nombres de columnas deben coincidir con la BD (is_active, deleted_at, etc.)
    const sql = `
      INSERT INTO "inventario"."stocks" (
        "productoId", "bodegaId", "stockActual", "stockReservado",
        "stockDisponible", "stockMinimo", "stockMaximo",
        "precioPromedio", "precioUltimo", "fechaUltimoMovimiento",
        "fechaUltimaActualizacion", "observaciones", "is_active",
        "created_at", "updated_at", "deleted_at"
      ) VALUES (
        $1, $2, $3, 0, $3, 0, 0,
        /* precioPromedio inicial */ $4::numeric,
        /* precioUltimo */ $4::numeric,
        NOW(), NOW(), NULL, TRUE, NOW(), NOW(), NULL
      )
      ON CONFLICT ("productoId", "bodegaId") DO UPDATE SET
        "stockActual" = "inventario"."stocks"."stockActual" + EXCLUDED."stockActual",
        "stockDisponible" = ("inventario"."stocks"."stockActual" + EXCLUDED."stockActual") - "inventario"."stocks"."stockReservado",
        "precioUltimo" = COALESCE(EXCLUDED."precioUltimo", "inventario"."stocks"."precioUltimo"),
        "precioPromedio" = CASE
          WHEN EXCLUDED."precioUltimo" IS NULL THEN "inventario"."stocks"."precioPromedio"
          WHEN ("inventario"."stocks"."stockActual" + EXCLUDED."stockActual") > 0 THEN (
            COALESCE("inventario"."stocks"."precioPromedio", 0) * "inventario"."stocks"."stockActual" + EXCLUDED."stockActual" * COALESCE(EXCLUDED."precioUltimo", 0)
          ) / NULLIF(("inventario"."stocks"."stockActual" + EXCLUDED."stockActual"), 0)
          ELSE EXCLUDED."precioUltimo"
        END,
        "fechaUltimoMovimiento" = NOW(),
        "fechaUltimaActualizacion" = NOW(),
        "is_active" = TRUE,
        "deleted_at" = NULL,
        "updated_at" = NOW();
    `

    await this.manager.query(sql, params)
  }
}
