import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm'
import { Ciudadano } from './ciudadano.entity'
import { Funcionario } from './funcionario.entity'
import { Pqr } from '../../pqr/entities/pqr.entity'
import { Trazabilidad } from '../../pqr/entities/trazabilidad.entity'

export enum UserRole {
  CIUDADANO = 'ciudadano',
  FUNCIONARIO = 'funcionario',
  LIDER_DEPENDENCIA = 'lider_dependencia',
  ADMINISTRADOR = 'administrador',
  AUDITOR = 'auditor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CIUDADANO,
  })
  rol: UserRole

  @Column({ default: true })
  isActive: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @OneToOne(() => Ciudadano, (ciudadano) => ciudadano.user)
  ciudadano?: Ciudadano

  @OneToOne(() => Funcionario, (funcionario) => funcionario.user)
  funcionario?: Funcionario

  @OneToMany(() => Pqr, (pqr) => pqr.radicadoPorFuncionario)
  pqrsRadicados: Pqr[]

  @OneToMany(() => Pqr, (pqr) => pqr.funcionarioAsignado)
  pqrsAsignados: Pqr[]

  @OneToMany(() => Trazabilidad, (trazabilidad) => trazabilidad.usuarioQueActua)
  trazabilidades: Trazabilidad[]
}
