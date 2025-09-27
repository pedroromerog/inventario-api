import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { User } from './user.entity'
import { Dependencia } from '../../organigrama/entities/dependencia.entity'

@Entity('funcionarios')
export class Funcionario {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  nombres: string

  @Column()
  apellidos: string

  @Column()
  cargo: string

  @Column({ nullable: true })
  telefono?: string

  @Column({ nullable: true })
  email?: string

  @Column({ nullable: true })
  direccion?: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaIngreso: Date

  @Column({ default: true })
  isActive: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @OneToOne(() => User, (user) => user.funcionario)
  @JoinColumn()
  user?: User

  @ManyToOne(() => Dependencia, (dependencia) => dependencia.funcionarios)
  @JoinColumn()
  dependencia: Dependencia
}
