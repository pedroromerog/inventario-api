import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../../users/users.service'
import { LoginDto } from '../dto/login.dto'
import { AuthResponseDto } from '../dto/auth-response.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class LoginAction {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password, rememberMe } = loginDto
    // Validar usuario
    const user = await this.usersService.findByUsername(username)
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    // Verificar estado del usuario
    if (user.estado !== 'activo') {
      throw new BadRequestException('Usuario no está activo')
    }

    // Generar tokens
    const payload = { username: user.username, sub: user.id, rol: user.rol }
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: rememberMe ? '7d' : '1h',
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    })

    // Actualizar último acceso
    await this.usersService.updateLastAccess(user.id)

    return {
      accessToken,
      refreshToken,
      expiresIn: rememberMe ? 7 * 24 * 60 * 60 : 60 * 60, // 7 días o 1 hora
      tokenType: 'Bearer',
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        estado: user.estado,
        rol: user.rol,
        telefono: user.telefono,
        departamento: user.departamento,
        cargo: user.cargo,
        ultimoAcceso: user.ultimoAcceso,
      },
    }
  }
}
