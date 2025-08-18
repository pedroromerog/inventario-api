import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TipoBodega, EstadoBodega } from '../enums/bodega.enums'

@Entity('bodegas', { schema: 'inventario' })
@Index(['codigo'], { unique: true })
@Index(['tipo'])
@Index(['estado'])
export class Bodega {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string

  @Column({ type: 'varchar', length: 100 })
  nombre: string

  @Column({ type: 'text', nullable: true })
  descripcion?: string

  @Column({
    type: 'enum',
    enum: TipoBodega,
    default: TipoBodega.SECUNDARIA,
  })
  tipo: TipoBodega

  @Column({
    type: 'enum',
    enum: EstadoBodega,
    default: EstadoBodega.ACTIVA,
  })
  estado: EstadoBodega

  @Column({ type: 'text', nullable: true })
  direccion?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  ciudad?: string

  @Column({ type: 'varchar', length: 10, nullable: true })
  codigoPostal?: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string

  @Column({ type: 'text', nullable: true })
  notasEspeciales?: string

  @Column({ type: 'uuid', nullable: true })
  responsableId?: string

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

  // Hooks para normalización automática
  @BeforeInsert()
  @BeforeUpdate()
  normalizeData() {
    if (this.nombre) {
      this.nombre = this.nombre.trim()
    }
    if (this.descripcion) {
      this.descripcion = this.descripcion.trim()
    }
    if (this.codigo) {
      this.codigo = this.codigo.toUpperCase().trim()
    }
    if (this.ciudad) {
      this.ciudad = this.ciudad.trim()
    }
    if (this.direccion) {
      this.direccion = this.direccion.trim()
    }
  }
}
