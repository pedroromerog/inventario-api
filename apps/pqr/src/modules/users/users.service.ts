import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity'
import { Ciudadano } from './entities/ciudadano.entity'
import { Funcionario } from './entities/funcionario.entity'
import { Dependencia } from '../organigrama/entities/dependencia.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto'
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto'
import { CreateFuncionarioDto } from './dto/create-funcionario.dto'
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ciudadano)
    private readonly ciudadanoRepository: Repository<Ciudadano>,
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: Repository<Funcionario>,
    @InjectRepository(Dependencia)
    private readonly dependenciaRepository: Repository<Dependencia>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    })

    if (existingUser) {
      throw new ConflictException('El email ya está registrado')
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    return this.userRepository.save(user)
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['ciudadano'],
    })
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['ciudadano'],
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    return user
  }
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        ciudadano: true,
        funcionario: true,
      },
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    return user
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id)

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    Object.assign(user, updateUserDto)
    user.updatedAt = new Date()

    return this.userRepository.save(user)
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.findUserById(id)
    await this.userRepository.remove(user)
  }

  async createCiudadano(
    createCiudadanoDto: CreateCiudadanoDto,
  ): Promise<Ciudadano> {
    const existingCiudadano = await this.ciudadanoRepository.findOne({
      where: { numeroDocumento: createCiudadanoDto.numeroDocumento },
    })

    if (existingCiudadano) {
      throw new ConflictException('El número de documento ya está registrado')
    }

    const ciudadano = this.ciudadanoRepository.create(createCiudadanoDto)
    return this.ciudadanoRepository.save(ciudadano)
  }

  async findAllCiudadanos(): Promise<Ciudadano[]> {
    return this.ciudadanoRepository.find({
      relations: ['user'],
    })
  }

  async findCiudadanoById(id: string): Promise<Ciudadano> {
    const ciudadano = await this.ciudadanoRepository.findOne({
      where: { id },
      relations: ['user'],
    })

    if (!ciudadano) {
      throw new NotFoundException('Ciudadano no encontrado')
    }

    return ciudadano
  }

  async updateCiudadano(
    id: string,
    updateCiudadanoDto: UpdateCiudadanoDto,
  ): Promise<Ciudadano> {
    const ciudadano = await this.findCiudadanoById(id)
    Object.assign(ciudadano, updateCiudadanoDto)
    ciudadano.updatedAt = new Date()

    return this.ciudadanoRepository.save(ciudadano)
  }

  async removeCiudadano(id: string): Promise<void> {
    const ciudadano = await this.findCiudadanoById(id)
    await this.ciudadanoRepository.remove(ciudadano)
  }

  // Funcionarios
  async createFuncionario(
    createFuncionarioDto: CreateFuncionarioDto,
  ): Promise<Funcionario> {
    // Verificar que la dependencia existe
    const dependencia = await this.dependenciaRepository.findOne({
      where: { id: Number(createFuncionarioDto.dependenciaId) },
    })

    if (!dependencia) {
      throw new NotFoundException('Dependencia no encontrada')
    }

    // Verificar que el usuario existe si se proporciona
    let user: User | null = null
    if (createFuncionarioDto.userId) {
      user = await this.userRepository.findOne({
        where: { id: createFuncionarioDto.userId },
      })
      if (!user) {
        throw new NotFoundException('Usuario no encontrado')
      }
    }

    const funcionario = this.funcionarioRepository.create({
      ...createFuncionarioDto,
      dependencia,
      user: user || undefined,
      fechaIngreso: createFuncionarioDto.fechaIngreso
        ? new Date(createFuncionarioDto.fechaIngreso)
        : new Date(),
    })

    return this.funcionarioRepository.save(funcionario)
  }

  async findAllFuncionarios(): Promise<Funcionario[]> {
    return this.funcionarioRepository.find({
      relations: ['user', 'dependencia', 'dependencia.secretaria'],
    })
  }

  async findFuncionarioById(id: string): Promise<Funcionario> {
    const funcionario = await this.funcionarioRepository.findOne({
      where: { id },
      relations: ['user', 'dependencia', 'dependencia.secretaria'],
    })

    if (!funcionario) {
      throw new NotFoundException('Funcionario no encontrado')
    }

    return funcionario
  }

  async updateFuncionario(
    id: string,
    updateFuncionarioDto: UpdateFuncionarioDto,
  ): Promise<Funcionario> {
    const funcionario = await this.findFuncionarioById(id)

    // Actualizar dependencia si se proporciona
    if (updateFuncionarioDto.dependenciaId) {
      const dependencia = await this.dependenciaRepository.findOne({
        where: { id: updateFuncionarioDto.dependenciaId },
      })
      if (dependencia) {
        funcionario.dependencia = dependencia
      }
    }

    // Actualizar usuario si se proporciona
    if (updateFuncionarioDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateFuncionarioDto.userId },
      })
      if (user) {
        funcionario.user = user
      }
    }

    Object.assign(funcionario, updateFuncionarioDto)
    funcionario.updatedAt = new Date()

    return this.funcionarioRepository.save(funcionario)
  }

  async removeFuncionario(id: string): Promise<void> {
    const funcionario = await this.findFuncionarioById(id)
    await this.funcionarioRepository.remove(funcionario)
  }

  async findFuncionariosByDependencia(
    dependenciaId: number,
  ): Promise<Funcionario[]> {
    return this.funcionarioRepository.find({
      where: { dependencia: { id: dependenciaId } },
      relations: ['user', 'dependencia'],
    })
  }
}
