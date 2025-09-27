import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { User } from './user.entity'
import { Pqr } from '../../pqr/entities/pqr.entity'

export enum TipoDocumento {
  CC = 'CC',
  CE = 'CE',
  NIT = 'NIT',
  PASAPORTE = 'Pasaporte',
}

@Entity('ciudadanos')
export class Ciudadano {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: TipoDocumento,
  })
  tipoDocumento: TipoDocumento

  @Column({ unique: true })
  numeroDocumento: string

  @Column()
  nombreCompleto: string

  @Column()
  email: string

  @Column()
  telefono: string

  @Column()
  direccion: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @OneToOne(() => User, (user) => user.ciudadano)
  @JoinColumn()
  user?: User

  @OneToMany(() => Pqr, (pqr) => pqr.creadoPorCiudadano)
  pqrs: Pqr[]
}
