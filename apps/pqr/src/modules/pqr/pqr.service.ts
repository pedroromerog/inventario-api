import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserLogin } from '../../shared/interfaces/current-user.interface'
import { Dependencia } from '../organigrama/entities/dependencia.entity'
import { Secretaria } from '../organigrama/entities/secretaria.entity'
import { Ciudadano } from '../users/entities/ciudadano.entity'
import { User, UserRole } from '../users/entities/user.entity'
import { CreatePqrDto } from './dto/create-pqr.dto'
import { CreateTrazabilidadDto } from './dto/create-trazabilidad.dto'
import { UpdatePqrDto } from './dto/update-pqr.dto'
import { Pqr } from './entities/pqr.entity'
import { TipoActuacion, Trazabilidad } from './entities/trazabilidad.entity'
import { Funcionario } from '../users/entities/funcionario.entity'

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

  async findAllPqrsMine(id: string) {
    const [data, total] = await this.pqrRepository.findAndCount({
      where: { creadoPorCiudadano: { id } },
      relations: [
        'creadoPorCiudadano',
        'radicadoPorFuncionario',
        'secretariaAsignada',
        'dependenciaAsignada',
        'funcionarioAsignado',
        'trazabilidad',
      ],
    })
    return {
      data,
      total,
    }
  }

  /**
   * Revisar
   * @param createPqrDto
   * @returns
   */
  async createPqr(createPqrDto: CreatePqrDto, user: UserLogin): Promise<Pqr> {
    console.log('🚀>>> ~ user:', user)
    console.log('🚀>>> ~ createPqrDto:', createPqrDto)

    if (!createPqrDto.isAnonimo) {
      const usr = await this.userRepository.findOne({
        relations: {
          ciudadano: true,
          funcionario: true,
        },
        where: {
          id: user.id,
        },
      })
      if (usr?.rol === UserRole.CIUDADANO) {
        createPqrDto.creadoPorCiudadanoId = usr?.ciudadano?.id
      } else {
        createPqrDto.radicadoPorFuncionarioId = usr?.funcionario?.id
      }
    }
    // Generar radicado único
    const radicado = await this.generarRadicado()

    // Calcular fecha de vencimiento
    const fechaVencimiento = this.calcularFechaVencimiento(createPqrDto.tipo)

    // // Obtener ciudadano
    // const ciudadano = await this.ciudadanoRepository.findOne({
    //   where: { id: createPqrDto.creadoPorCiudadanoId },
    // })
    // console.log('🚀>>> ~ ciudadano:', ciudadano)

    // if (!ciudadano) {
    //   throw new NotFoundException('Ciudadano no encontrado')
    // }

    // Obtener funcionario si se proporciona
    // let radicadoPorFuncionario: User | undefined = undefined
    // if (createPqrDto.radicadoPorFuncionarioId) {
    //   const funcionario = await this.userRepository.findOne({
    //     where: { id: createPqrDto.radicadoPorFuncionarioId },
    //   })
    //   radicadoPorFuncionario = funcionario || undefined
    // }

    // Crear PQR
    const pqr: Pqr = this.pqrRepository.create({
      ...createPqrDto,
      radicado,
      fechaVencimiento: createPqrDto.fechaVencimiento
        ? new Date(createPqrDto.fechaVencimiento)
        : fechaVencimiento,
      // creadoPorCiudadano: ciudadano,
      // radicadoPorFuncionario,
    })

    const savedPqr = await this.pqrRepository.save(pqr)

    // Crear trazabilidad inicial
    await this.crearTrazabilidadInicial(savedPqr)

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

  private async crearTrazabilidadInicial(pqr: Pqr): Promise<void> {
    const descripcion = `PQR ${pqr.isAnonimo ? 'ANONIMO ' : ''}creado con radicado ${pqr.radicado}`
    const trazabilidad = this.trazabilidadRepository.create({
      tipoActuacion: TipoActuacion.CREACION,
      descripcion,
      usuarioQueActuaId: pqr.isAnonimo
        ? null
        : pqr.radicadoPorFuncionarioId || pqr.creadoPorCiudadanoId,
      pqr,
    })

    await this.trazabilidadRepository.save(trazabilidad)
  }
}
