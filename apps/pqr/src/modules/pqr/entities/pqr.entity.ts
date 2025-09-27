import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Ciudadano } from '../../users/entities/ciudadano.entity'
import { User } from '../../users/entities/user.entity'
import { Secretaria } from '../../organigrama/entities/secretaria.entity'
import { Dependencia } from '../../organigrama/entities/dependencia.entity'
import { Trazabilidad } from './trazabilidad.entity'

export enum TipoPqr {
  PETICION = 'peticion',
  QUEJA = 'queja',
  RECLAMO = 'reclamo',
  SUGERENCIA = 'sugerencia',
  DENUNCIA = 'denuncia',
}

export enum EstadoPqr {
  ABIERTO = 'abierto',
  EN_PROCESO = 'en_proceso',
  RESUELTO = 'resuelto',
  CERRADO = 'cerrado',
  TRANSFERIDO = 'transferido',
}

export enum CanalRecepcion {
  PORTAL_WEB = 'portal_web',
  FISICO = 'fisico',
  EMAIL = 'email',
  TELEFONICO = 'telefonico',
  OFICIO_REMITIDO = 'oficio_remitido',
}

@Entity('pqrs')
export class Pqr {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  radicado: string

  @Column()
  asunto: string

  @Column('text')
  descripcion: string

  @Column({
    type: 'enum',
    enum: TipoPqr,
  })
  tipo: TipoPqr

  @Column({
    type: 'enum',
    enum: EstadoPqr,
    default: EstadoPqr.ABIERTO,
  })
  estado: EstadoPqr

  @Column({
    type: 'enum',
    enum: CanalRecepcion,
  })
  canalRecepcion: CanalRecepcion

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date

  @Column({ type: 'date' })
  fechaVencimiento: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @ManyToOne(() => Ciudadano, (ciudadano) => ciudadano.pqrs)
  @JoinColumn()
  creadoPorCiudadano: Ciudadano

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  radicadoPorFuncionario?: User

  @ManyToOne(() => Secretaria, { nullable: true })
  @JoinColumn()
  secretariaAsignada?: Secretaria

  @ManyToOne(() => Dependencia, { nullable: true })
  @JoinColumn()
  dependenciaAsignada?: Dependencia

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  funcionarioAsignado?: User

  @OneToMany(() => Trazabilidad, (trazabilidad) => trazabilidad.pqr)
  trazabilidad: Trazabilidad[]
}
