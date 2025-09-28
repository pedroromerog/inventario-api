import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtOptionsFactory } from '@nestjs/jwt'

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions() {
    const jwt = this.configService.get('jwt')
    return {
      secret: jwt.secret,
      signOptions: {
        expiresIn: jwt.expiresIn,
      },
    }
  }
}
