import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TipoProveedor, EstadoProveedor } from '../enums/proveedor.enums'

@Entity('proveedores', { schema: 'inventario' })
@Index(['codigo'], { unique: true })
@Index(['nombre'])
export class Proveedor {
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
    enum: TipoProveedor,
    default: TipoProveedor.PRODUCTOS,
  })
  tipo: TipoProveedor

  @Column({
    type: 'enum',
    enum: EstadoProveedor,
    default: EstadoProveedor.ACTIVO,
  })
  estado: EstadoProveedor

  @Column({ type: 'varchar', length: 13, nullable: true })
  nit?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  razonSocial?: string

  @Column({ type: 'text', nullable: true })
  direccion?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  ciudad?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  departamento?: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  sitioWeb?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  contactoPrincipal?: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefonoContacto?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailContacto?: string

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
    if (this.nit) {
      this.nit = this.nit.toUpperCase().trim()
    }
    if (this.razonSocial) {
      this.razonSocial = this.razonSocial.trim()
    }
    if (this.ciudad) {
      this.ciudad = this.ciudad.trim()
    }
    if (this.direccion) {
      this.direccion = this.direccion.trim()
    }
  }
}
