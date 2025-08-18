import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TipoCategoria, EstadoCategoria } from '../enums/categoria.enums'

@Entity('categorias', { schema: 'inventario' })
@Index(['codigo'], { unique: true })
@Index(['tipo'])
export class Categoria {
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
    enum: TipoCategoria,
    default: TipoCategoria.PRODUCTO,
  })
  tipo: TipoCategoria

  @Column({
    type: 'enum',
    enum: EstadoCategoria,
    default: EstadoCategoria.ACTIVA,
  })
  estado: EstadoCategoria

  @Column({ type: 'varchar', length: 7, default: '#000000' })
  color?: string

  @Column({ type: 'int', default: 0 })
  orden: number

  @Column({ type: 'text', nullable: true })
  notas?: string

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
  }
}
