import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../../users/users.service'
import { RefreshTokenDto } from '../dto/refresh-token.dto'
import { RefreshTokenResponseDto } from '../dto/auth-response.dto'

@Injectable()
export class RefreshTokenAction {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async execute(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    try {
      // Verificar el refresh token
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })

      // Verificar que el usuario existe y está activo
      const user = await this.usersService.findOne(payload.sub)
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Usuario no válido')
      }

      // Generar nuevos tokens
      const newPayload = {
        username: user.username,
        sub: user.id,
        rol: user.rol,
      }
      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      })

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      })

      return {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 60 * 60, // 1 hora
        tokenType: 'Bearer',
      }
    } catch (error) {
      throw new UnauthorizedException('Token de refresco inválido')
    }
  }
}
