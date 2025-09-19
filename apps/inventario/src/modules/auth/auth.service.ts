import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import {
  AuthResponseDto,
  RefreshTokenResponseDto,
  LogoutResponseDto,
} from './dto/auth-response.dto'
import { User } from '../users/entities/user.entity'
import { LoginAction } from './actions/login.action'
import { RegisterAction } from './actions/register.action'
import { RefreshTokenAction } from './actions/refresh-token.action'
import { Response } from 'express'
import { cookieConfig } from '../../config/cookie.config'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly loginAction: LoginAction,
    private readonly registerAction: RegisterAction,
    private readonly refreshTokenAction: RefreshTokenAction,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.loginAction.execute(loginDto)
  }

  async register(registerDto: RegisterDto): Promise<User> {
    return this.registerAction.execute(registerDto)
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.refreshTokenAction.execute(refreshTokenDto)
  }

  async logout(userId: string): Promise<LogoutResponseDto> {
    // En una implementación más robusta, aquí se invalidaría el refresh token
    // Por ahora solo retornamos un mensaje de éxito
    return {
      message: 'Sesión cerrada exitosamente',
      success: true,
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findOne(userId)
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado')
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    )
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta')
    }

    // Verificar que las nuevas contraseñas coincidan
    if (
      changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword
    ) {
      throw new UnauthorizedException('Las nuevas contraseñas no coinciden')
    }

    // Encriptar nueva contraseña
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltRounds,
    )

    // Actualizar contraseña
    await this.usersService.updatePassword(userId, hashedNewPassword)
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.usersService.findOne(userId)
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado')
    }

    const { password, ...result } = user
    return result
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      throw new UnauthorizedException('Token inválido')
    }
  }
}
