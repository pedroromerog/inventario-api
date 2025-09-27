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
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto'
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ciudadano)
    private readonly ciudadanoRepository: Repository<Ciudadano>,
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
}
