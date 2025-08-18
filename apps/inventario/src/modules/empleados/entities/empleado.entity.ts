import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm'
import { TipoEmpleado, EstadoEmpleado } from '../enums/empleado.enums'

@Entity('empleados', { schema: 'inventario' })
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  codigo: string

  @Column({ type: 'varchar', length: 100 })
  nombres: string

  @Column({ type: 'varchar', length: 100 })
  apellidos: string

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  email: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string

  @Column({ type: 'enum', enum: TipoEmpleado, default: TipoEmpleado.OPERATIVO })
  tipo: TipoEmpleado

  @Column({
    type: 'enum',
    enum: EstadoEmpleado,
    default: EstadoEmpleado.ACTIVO,
  })
  estado: EstadoEmpleado

  @Column({ type: 'varchar', length: 100, nullable: true })
  cargo: string

  @Column({ type: 'date', nullable: true })
  fechaContratacion: Date

  @Column({ type: 'text', nullable: true })
  observaciones: string

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date
}
