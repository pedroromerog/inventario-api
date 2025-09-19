import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../../users/users.service'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Extraer token desde cookie (método principal)
        (request: Request) => {
          return request?.cookies?.access_token
        },
        // Fallback: extraer desde header Authorization
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    })
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub)
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido o inactivo')
    }

    // Actualizar último acceso
    await this.usersService.updateLastAccess(user.id)

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: user.rol,
      estado: user.estado,
    }
  }
}
