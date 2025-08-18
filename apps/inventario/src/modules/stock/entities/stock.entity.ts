import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Producto } from '../../productos/entities/producto.entity'
import { Bodega } from '../../bodegas/entities/bodega.entity'
import { EstadoStock } from '../enums/stock.enums'

@Entity('stocks', { schema: 'inventario' })
@Index(['productoId', 'bodegaId'], { unique: true })
@Index(['productoId'])
@Index(['bodegaId'])
export class Stock {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  productoId: number

  @Column({ type: 'int' })
  bodegaId: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stockActual: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stockReservado: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stockDisponible: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stockMinimo: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stockMaximo: number

  @Column({
    type: 'enum',
    enum: EstadoStock,
    default: EstadoStock.DISPONIBLE,
  })
  estado: EstadoStock

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioPromedio?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioUltimo?: number

  @Column({ type: 'date', nullable: true })
  fechaUltimoMovimiento?: Date

  @Column({ type: 'date', nullable: true })
  fechaUltimaActualizacion?: Date

  @Column({ type: 'text', nullable: true })
  observaciones?: string

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date

  // Relación con el producto
  @ManyToOne(() => Producto, { nullable: false })
  @JoinColumn({ name: 'productoId' })
  producto: Producto

  // Relación con la bodega
  @ManyToOne(() => Bodega, { nullable: false })
  @JoinColumn({ name: 'bodegaId' })
  bodega: Bodega

  // Hooks para normalización automática y cálculos
  @BeforeInsert()
  @BeforeUpdate()
  normalizeData() {
    // Calcular stock disponible
    this.stockDisponible = this.stockActual - this.stockReservado

    // Determinar estado basado en stock
    if (this.stockDisponible <= 0) {
      this.estado = EstadoStock.AGOTADO
    } else if (this.stockDisponible <= this.stockMinimo) {
      this.estado = EstadoStock.EN_REVISION
    } else if (this.stockReservado > 0) {
      this.estado = EstadoStock.RESERVADO
    } else {
      this.estado = EstadoStock.DISPONIBLE
    }

    // Actualizar fechas
    if (
      this.stockActual !== this.stockActual ||
      this.stockReservado !== this.stockReservado
    ) {
      this.fechaUltimaActualizacion = new Date()
    }

    if (this.observaciones) {
      this.observaciones = this.observaciones.trim()
    }
  }
}
