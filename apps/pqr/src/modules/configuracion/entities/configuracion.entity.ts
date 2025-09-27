import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('configuracion')
export class ConfiguracionEntidad {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  nit: string

  @Column()
  nombreOficial: string

  @Column({ nullable: true })
  logotipoUrl?: string

  @Column()
  nombreAlcaldeActual: string

  @Column({ nullable: true })
  eslogan?: string

  @Column({ nullable: true })
  urlPaginaWeb?: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date
}
