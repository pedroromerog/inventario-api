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
import { EstadoUsuario } from '../enums/user.enums'
import { Rol } from '../../roles/entities/rol.entity'

@Entity('users', { schema: 'auth' })
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string

  @Column({ type: 'varchar', length: 100 })
  nombre: string

  @Column({ type: 'varchar', length: 100 })
  apellido: string

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string

  @Column({ type: 'varchar', length: 255 })
  password: string

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    default: EstadoUsuario.PENDIENTE_ACTIVACION,
  })
  estado: EstadoUsuario

  @Column({ name: 'rol_id', type: 'int', nullable: false })
  rolId: number

  @ManyToOne(() => Rol, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  departamento?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  cargo?: string

  @Column({ type: 'text', nullable: true })
  notas?: string

  @Column({ type: 'timestamp', nullable: true })
  ultimoAcceso?: Date

  @Column({ type: 'boolean', default: false })
  requiereCambioPassword?: boolean

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
    if (this.username) {
      this.username = this.username.toLowerCase().trim()
    }
    if (this.nombre) {
      this.nombre = this.nombre.trim()
    }
    if (this.apellido) {
      this.apellido = this.apellido.trim()
    }
    if (this.email) {
      this.email = this.email.toLowerCase().trim()
    }
    if (this.telefono) {
      this.telefono = this.telefono.trim()
    }
    if (this.departamento) {
      this.departamento = this.departamento.trim()
    }
    if (this.cargo) {
      this.cargo = this.cargo.trim()
    }
    if (this.notas) {
      this.notas = this.notas.trim()
    }
  }
}
