import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import {
  EstadoMovimiento,
  MotivoMovimiento,
  TipoMovimiento,
  TipoOperacion,
} from '../enums/movimiento.enums'

@Entity('movimientos', { schema: 'inventario' })
@Index(['codigo'], { unique: true })
@Index(['tipo'])
@Index(['productoId'])
export class Movimiento {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string

  @Column({
    type: 'enum',
    enum: TipoMovimiento,
    default: TipoMovimiento.TRANSFERENCIA,
  })
  tipo: TipoMovimiento

  @Column({
    type: 'enum',
    enum: TipoOperacion,
    nullable: false,
  })
  operacion: TipoOperacion

  @Column({
    type: 'enum',
    enum: EstadoMovimiento,
    default: EstadoMovimiento.PENDIENTE,
  })
  estado: EstadoMovimiento

  @Column({
    type: 'enum',
    enum: MotivoMovimiento,
    default: MotivoMovimiento.TRANSFERENCIA_BODEGA,
  })
  motivo: MotivoMovimiento

  @Column({ type: 'int', nullable: true })
  bodegaOrigenId?: number

  @Column({ type: 'int', nullable: true })
  bodegaDestinoId?: number

  @Column({ type: 'int' })
  productoId: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioUnitario?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioTotal?: number

  @Column({ type: 'date' })
  fechaMovimiento: Date

  @Column({ type: 'varchar', length: 100, nullable: true })
  referencia?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  numeroDocumento?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipoDocumento?: string

  @Column({ type: 'text', nullable: true })
  observaciones?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  solicitante?: string

  @Column({ type: 'uuid', nullable: true })
  autorizadorId?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  evidenciaUrl?: string

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

  // Relación con el usuario autorizador
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'autorizadorId' })
  autorizador?: User

  // Hooks para normalización automática
  @BeforeInsert()
  @BeforeUpdate()
  normalizeData() {
    if (this.codigo) {
      this.codigo = this.codigo.toUpperCase().trim()
    }
    if (this.referencia) {
      this.referencia = this.referencia.trim()
    }
    if (this.numeroDocumento) {
      this.numeroDocumento = this.numeroDocumento.trim()
    }
    if (this.tipoDocumento) {
      this.tipoDocumento = this.tipoDocumento.trim()
    }
    if (this.observaciones) {
      this.observaciones = this.observaciones.trim()
    }
    if (this.solicitante) {
      this.solicitante = this.solicitante.trim()
    }
  }
}
