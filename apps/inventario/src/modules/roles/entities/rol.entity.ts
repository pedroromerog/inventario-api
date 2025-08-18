import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('roles', { schema: 'auth' })
@Index(['codigo'], { unique: true })
@Index(['nombre'])
export class Rol {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string

  @Column({ type: 'varchar', length: 100 })
  nombre: string

  @Column({ type: 'json', nullable: true })
  permisos: string[]

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
    if (this.codigo) {
      this.codigo = this.codigo.trim().toUpperCase()
    }

    if (this.nombre) {
      this.nombre = this.nombre.trim()
    }
  }
}
