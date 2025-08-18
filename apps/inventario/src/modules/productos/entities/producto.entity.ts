import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm'
import {
  TipoProducto,
  EstadoProducto,
  UnidadMedida,
} from '../enums/producto.enums'

@Entity('productos', { schema: 'inventario' })
@Index(['codigo'], { unique: true })
@Index(['tipo'])
@Index(['estado'])
export class Producto {
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
    enum: TipoProducto,
    default: TipoProducto.PRODUCTO,
  })
  tipo: TipoProducto

  @Column({
    type: 'enum',
    enum: EstadoProducto,
    default: EstadoProducto.ACTIVO,
  })
  estado: EstadoProducto

  @Column({
    type: 'enum',
    enum: UnidadMedida,
    default: UnidadMedida.UNIDAD,
  })
  unidadMedida: UnidadMedida

  @Column({ type: 'int', nullable: true })
  categoriaId?: number

  @Column({ type: 'int', nullable: true })
  proveedorId?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioCompra?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioVenta?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioPromedio?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stockMinimo: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stockMaximo: number

  @Column({ type: 'varchar', length: 100, nullable: true })
  marca?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelo?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  color?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  dimensiones?: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  peso?: number

  @Column({ type: 'text', nullable: true })
  especificaciones?: string

  @Column({ type: 'text', nullable: true })
  instrucciones?: string

  @Column({ type: 'text', nullable: true })
  notas?: string

  @Column({ type: 'boolean', default: false })
  requiereRefrigeracion?: boolean

  @Column({ type: 'boolean', default: false })
  esFragil?: boolean

  @Column({ type: 'boolean', default: false })
  esPeligroso?: boolean

  @Column({ type: 'int', default: 0 })
  diasVidaUtil?: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagenUrl?: string

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
    if (this.marca) {
      this.marca = this.marca.trim()
    }
    if (this.modelo) {
      this.modelo = this.modelo.trim()
    }
    if (this.color) {
      this.color = this.color.trim()
    }
    if (this.dimensiones) {
      this.dimensiones = this.dimensiones.trim()
    }
    if (this.especificaciones) {
      this.especificaciones = this.especificaciones.trim()
    }
    if (this.instrucciones) {
      this.instrucciones = this.instrucciones.trim()
    }
  }
}
