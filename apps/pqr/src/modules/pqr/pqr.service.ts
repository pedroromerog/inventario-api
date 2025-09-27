import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pqr } from './entities/pqr.entity'
import { Trazabilidad } from './entities/trazabilidad.entity'
import { Ciudadano } from '../users/entities/ciudadano.entity'
import { User } from '../users/entities/user.entity'
import { Secretaria } from '../organigrama/entities/secretaria.entity'
import { Dependencia } from '../organigrama/entities/dependencia.entity'
import { CreatePqrDto } from './dto/create-pqr.dto'
import { UpdatePqrDto } from './dto/update-pqr.dto'
import { CreateTrazabilidadDto } from './dto/create-trazabilidad.dto'
import { TipoActuacion } from './entities/trazabilidad.entity'

@Injectable()
export class PqrService {
  constructor(
    @InjectRepository(Pqr)
    private readonly pqrRepository: Repository<Pqr>,
    @InjectRepository(Trazabilidad)
    private readonly trazabilidadRepository: Repository<Trazabilidad>,
    @InjectRepository(Ciudadano)
    private readonly ciudadanoRepository: Repository<Ciudadano>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Secretaria)
    private readonly secretariaRepository: Repository<Secretaria>,
    @InjectRepository(Dependencia)
    private readonly dependenciaRepository: Repository<Dependencia>,
  ) {}

  async createPqr(createPqrDto: CreatePqrDto): Promise<Pqr> {
    // Generar radicado único
    const radicado = await this.generarRadicado()

    // Calcular fecha de vencimiento
    const fechaVencimiento = this.calcularFechaVencimiento(createPqrDto.tipo)

    // Obtener ciudadano
    const ciudadano = await this.ciudadanoRepository.findOne({
      where: { id: createPqrDto.creadoPorCiudadanoId },
    })

    if (!ciudadano) {
      throw new NotFoundException('Ciudadano no encontrado')
    }

    // Obtener funcionario si se proporciona
    let radicadoPorFuncionario: User | undefined = undefined
    if (createPqrDto.radicadoPorFuncionarioId) {
      const funcionario = await this.userRepository.findOne({
        where: { id: createPqrDto.radicadoPorFuncionarioId },
      })
      radicadoPorFuncionario = funcionario || undefined
    }

    // Crear PQR
    const pqr: Pqr = this.pqrRepository.create({
      ...createPqrDto,
      radicado,
      fechaVencimiento: createPqrDto.fechaVencimiento
        ? new Date(createPqrDto.fechaVencimiento)
        : fechaVencimiento,
      creadoPorCiudadano: ciudadano,
      radicadoPorFuncionario,
    })

    const savedPqr = await this.pqrRepository.save(pqr)

    // Crear trazabilidad inicial
    await this.crearTrazabilidadInicial(savedPqr, radicadoPorFuncionario)

    return savedPqr
  }

  async findAllPqrs(): Promise<Pqr[]> {
    return this.pqrRepository.find({
      relations: [
        'creadoPorCiudadano',
        'radicadoPorFuncionario',
        'secretariaAsignada',
        'dependenciaAsignada',
        'funcionarioAsignado',
        'trazabilidad',
      ],
    })
  }

  async findPqrById(id: string): Promise<Pqr> {
    const pqr = await this.pqrRepository.findOne({
      where: { id },
      relations: [
        'creadoPorCiudadano',
        'radicadoPorFuncionario',
        'secretariaAsignada',
        'dependenciaAsignada',
        'funcionarioAsignado',
        'trazabilidad',
      ],
    })

    if (!pqr) {
      throw new NotFoundException('PQR no encontrado')
    }

    return pqr
  }

  async updatePqr(id: string, updatePqrDto: UpdatePqrDto): Promise<Pqr> {
    const pqr = await this.findPqrById(id)

    // Obtener entidades relacionadas si se proporcionan
    if (updatePqrDto.secretariaAsignadaId) {
      const secretaria = await this.secretariaRepository.findOne({
        where: { id: updatePqrDto.secretariaAsignadaId },
      })
      if (secretaria) {
        pqr.secretariaAsignada = secretaria
      }
    }

    if (updatePqrDto.dependenciaAsignadaId) {
      const dependencia = await this.dependenciaRepository.findOne({
        where: { id: updatePqrDto.dependenciaAsignadaId },
      })
      if (dependencia) {
        pqr.dependenciaAsignada = dependencia
      }
    }

    if (updatePqrDto.funcionarioAsignadoId) {
      const funcionario = await this.userRepository.findOne({
        where: { id: updatePqrDto.funcionarioAsignadoId },
      })
      if (funcionario) {
        pqr.funcionarioAsignado = funcionario
      }
    }

    Object.assign(pqr, updatePqrDto)
    pqr.updatedAt = new Date()

    return this.pqrRepository.save(pqr)
  }

  async removePqr(id: string): Promise<void> {
    const pqr = await this.findPqrById(id)
    await this.pqrRepository.remove(pqr)
  }

  async createTrazabilidad(
    createTrazabilidadDto: CreateTrazabilidadDto,
  ): Promise<Trazabilidad> {
    const usuario = await this.userRepository.findOne({
      where: { id: createTrazabilidadDto.usuarioQueActuaId },
    })

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado')
    }

    const pqr = await this.pqrRepository.findOne({
      where: { id: createTrazabilidadDto.pqrId },
    })

    if (!pqr) {
      throw new NotFoundException('PQR no encontrado')
    }

    const trazabilidad = this.trazabilidadRepository.create({
      ...createTrazabilidadDto,
      usuarioQueActua: usuario,
      pqr,
    })

    return this.trazabilidadRepository.save(trazabilidad)
  }

  private async generarRadicado(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.pqrRepository.count()
    const numero = String(count + 1).padStart(5, '0')
    return `ALC-PQR-${year}-${numero}`
  }

  private calcularFechaVencimiento(tipo: string): Date {
    const fechaCreacion = new Date()
    let diasSLA = 15 // Por defecto

    // Calcular SLA según el tipo de PQR
    switch (tipo) {
      case 'peticion':
        diasSLA = 15
        break
      case 'queja':
        diasSLA = 15
        break
      case 'reclamo':
        diasSLA = 15
        break
      case 'sugerencia':
        diasSLA = 15
        break
      case 'denuncia':
        diasSLA = 15
        break
    }

    // Calcular fecha de vencimiento excluyendo fines de semana
    let fechaVencimiento = new Date(fechaCreacion)
    let diasAgregados = 0

    while (diasAgregados < diasSLA) {
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 1)

      // Excluir sábados (6) y domingos (0)
      if (fechaVencimiento.getDay() !== 0 && fechaVencimiento.getDay() !== 6) {
        diasAgregados++
      }
    }

    return fechaVencimiento
  }

  private async crearTrazabilidadInicial(
    pqr: Pqr,
    funcionario?: User,
  ): Promise<void> {
    const trazabilidad = this.trazabilidadRepository.create({
      tipoActuacion: TipoActuacion.CREACION,
      descripcion: `PQR creado con radicado ${pqr.radicado}`,
      usuarioQueActua: funcionario || pqr.creadoPorCiudadano.user,
      pqr,
    })

    await this.trazabilidadRepository.save(trazabilidad)
  }
}
