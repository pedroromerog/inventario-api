import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserRole } from '../users/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email)

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const payload = { email: user.email, sub: user.id, rol: user.rol }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
      },
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      // Crear usuario con rol ciudadano
      const user = await this.usersService.createUser({
        email: registerDto.email,
        password: registerDto.password,
        rol: UserRole.CIUDADANO,
      })

      // Crear ciudadano asociado
      const ciudadano = await this.usersService.createCiudadano({
        tipoDocumento: registerDto.tipoDocumento,
        numeroDocumento: registerDto.numeroDocumento,
        nombreCompleto: registerDto.nombreCompleto,
        email: registerDto.email,
        telefono: registerDto.telefono,
        direccion: registerDto.direccion,
        userId: user.id,
      })

      const payload = { email: user.email, sub: user.id, rol: user.rol }

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          rol: user.rol,
        },
        ciudadano,
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new ConflictException('Error al registrar el usuario')
    }
  }
}
