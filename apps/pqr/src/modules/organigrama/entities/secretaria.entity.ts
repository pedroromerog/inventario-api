import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Dependencia } from './dependencia.entity'

@Entity('secretarias')
export class Secretaria {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  nombre: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @OneToMany(() => Dependencia, (dependencia) => dependencia.secretaria)
  dependencias: Dependencia[]
}
