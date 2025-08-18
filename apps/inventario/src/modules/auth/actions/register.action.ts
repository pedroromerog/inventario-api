import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { UsersService } from '../../users/users.service'
import { RegisterDto } from '../dto/register.dto'
import { User } from '../../users/entities/user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class RegisterAction {
  constructor(private readonly usersService: UsersService) {}

  async execute(registerDto: RegisterDto): Promise<User> {
    const { username, email, password, confirmPassword, ...userData } =
      registerDto

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden')
    }

    // Verificar que el username no exista
    const existingUsername = await this.usersService.findByUsername(username)
    if (existingUsername) {
      throw new ConflictException('El username ya está en uso')
    }

    // Verificar que el email no exista
    const existingEmail = await this.usersService.findByEmail(email)
    if (existingEmail) {
      throw new ConflictException('El email ya está en uso')
    }

    // Encriptar contraseña
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Crear usuario
    const createUserDto = {
      ...userData,
      username,
      email,
      password: hashedPassword,
      estado: 'pendiente_activacion' as any,
      rolId: userData.rolId || 3, // 3 es el ID del rol OPERADOR por defecto
    }

    return this.usersService.create(createUserDto)
  }
}
