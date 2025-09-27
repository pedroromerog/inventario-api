import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Secretaria } from './secretaria.entity'
import { Funcionario } from '../../users/entities/funcionario.entity'

@Entity('dependencias')
export class Dependencia {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nombre: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @ManyToOne(() => Secretaria, (secretaria) => secretaria.dependencias)
  @JoinColumn()
  secretaria: Secretaria

  @OneToMany(() => Funcionario, (funcionario) => funcionario.dependencia)
  funcionarios: Funcionario[]
}
