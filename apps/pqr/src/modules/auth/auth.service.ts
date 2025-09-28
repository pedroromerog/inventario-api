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
import { RefreshDto } from './dto/refresh.dto'
import { UserRole } from '../users/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(username)

    if (!user) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password)

    if (!isPasswordValid) {
      return null
    }
    return user
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, rol: user.rol }
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    await this.usersService.setRefreshToken(user.id, hashedRefreshToken)
    return {
      access_token: this.jwtService.sign(payload),
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
        ciudadano: user.ciudadano,
        funcionario: user.funcionario,
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

  async refresh(refreshDto: RefreshDto) {
    const userId = this.jwtService.decode(refreshDto.refreshToken).sub
    const user = await this.usersService.findUserById(userId)

    // Compara el refresh token recibido con el guardado en la BD
    const isValid = await bcrypt.compare(
      refreshDto.refreshToken,
      user.refreshToken,
    )
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token')
    }
    return this.login(user)
  }
}
