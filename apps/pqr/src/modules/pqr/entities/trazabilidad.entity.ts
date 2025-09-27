import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Pqr } from './pqr.entity'

export enum TipoActuacion {
  CREACION = 'Creacion',
  ASIGNACION_SECRETARIA = 'Asignacion_Secretaria',
  ASIGNACION_FUNCIONARIO = 'Asignacion_Funcionario',
  REASIGNACION = 'Reasignacion',
  PROYECCION_RESPUESTA = 'Proyeccion_Respuesta',
  RESPUESTA_OFICIAL = 'Respuesta_Oficial',
  CIERRE = 'Cierre',
}

@Entity('trazabilidad')
export class Trazabilidad {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date

  @Column({
    type: 'enum',
    enum: TipoActuacion,
  })
  tipoActuacion: TipoActuacion

  @Column('text')
  descripcion: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @ManyToOne(() => User)
  @JoinColumn()
  usuarioQueActua: User

  @ManyToOne(() => Pqr, (pqr) => pqr.trazabilidad)
  @JoinColumn()
  pqr: Pqr
}
