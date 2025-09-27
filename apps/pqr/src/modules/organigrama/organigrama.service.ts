import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Secretaria } from './entities/secretaria.entity'
import { Dependencia } from './entities/dependencia.entity'
import { CreateSecretariaDto } from './dto/create-secretaria.dto'
import { UpdateSecretariaDto } from './dto/update-secretaria.dto'
import { CreateDependenciaDto } from './dto/create-dependencia.dto'
import { UpdateDependenciaDto } from './dto/update-dependencia.dto'

@Injectable()
export class OrganigramaService {
  constructor(
    @InjectRepository(Secretaria)
    private readonly secretariaRepository: Repository<Secretaria>,
    @InjectRepository(Dependencia)
    private readonly dependenciaRepository: Repository<Dependencia>,
  ) {}

  // Secretarias
  async createSecretaria(
    createSecretariaDto: CreateSecretariaDto,
  ): Promise<Secretaria> {
    const existingSecretaria = await this.secretariaRepository.findOne({
      where: { nombre: createSecretariaDto.nombre },
    })

    if (existingSecretaria) {
      throw new ConflictException('Ya existe una secretaría con ese nombre')
    }

    const secretaria = this.secretariaRepository.create(createSecretariaDto)
    return this.secretariaRepository.save(secretaria)
  }

  async findAllSecretarias(): Promise<Secretaria[]> {
    return this.secretariaRepository.find({
      relations: ['dependencias'],
    })
  }

  async findSecretariaById(id: number): Promise<Secretaria> {
    const secretaria = await this.secretariaRepository.findOne({
      where: { id },
      relations: ['dependencias'],
    })

    if (!secretaria) {
      throw new NotFoundException('Secretaría no encontrada')
    }

    return secretaria
  }

  async updateSecretaria(
    id: number,
    updateSecretariaDto: UpdateSecretariaDto,
  ): Promise<Secretaria> {
    const secretaria = await this.findSecretariaById(id)
    Object.assign(secretaria, updateSecretariaDto)
    secretaria.updatedAt = new Date()

    return this.secretariaRepository.save(secretaria)
  }

  async removeSecretaria(id: number): Promise<void> {
    const secretaria = await this.findSecretariaById(id)
    await this.secretariaRepository.remove(secretaria)
  }

  // Dependencias
  async createDependencia(
    createDependenciaDto: CreateDependenciaDto,
  ): Promise<Dependencia> {
    const secretaria = await this.findSecretariaById(
      createDependenciaDto.secretariaId,
    )

    const dependencia = this.dependenciaRepository.create({
      nombre: createDependenciaDto.nombre,
      secretaria,
    })

    return this.dependenciaRepository.save(dependencia)
  }

  async findAllDependencias(): Promise<Dependencia[]> {
    return this.dependenciaRepository.find({
      relations: ['secretaria'],
    })
  }

  async findDependenciaById(id: number): Promise<Dependencia> {
    const dependencia = await this.dependenciaRepository.findOne({
      where: { id },
      relations: ['secretaria'],
    })

    if (!dependencia) {
      throw new NotFoundException('Dependencia no encontrada')
    }

    return dependencia
  }

  async updateDependencia(
    id: number,
    updateDependenciaDto: UpdateDependenciaDto,
  ): Promise<Dependencia> {
    const dependencia = await this.findDependenciaById(id)

    if (updateDependenciaDto.secretariaId) {
      const secretaria = await this.findSecretariaById(
        updateDependenciaDto.secretariaId,
      )
      dependencia.secretaria = secretaria
    }

    Object.assign(dependencia, updateDependenciaDto)
    dependencia.updatedAt = new Date()

    return this.dependenciaRepository.save(dependencia)
  }

  async removeDependencia(id: number): Promise<void> {
    const dependencia = await this.findDependenciaById(id)
    await this.dependenciaRepository.remove(dependencia)
  }
}
