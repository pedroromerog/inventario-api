import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current-user.decorator'
import { Public } from './decorators/public.decorator'
import { LoginDto } from './dto/login.dto'
import { RefreshDto } from './dto/refresh.dto'
import { RegisterDto } from './dto/register.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req: any) {
    return this.authService.login(req.user)
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Public()
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto)
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return {
      message: 'Autenticación exitosa',
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
        isActive: user.isActive,
      },
    }
  }

  @Get('test')
  testAuth(@CurrentUser() user: User) {
    console.log('🚀>>> testAuth endpoint called with user:', user)
    return {
      message: 'Token válido',
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
      },
      timestamp: new Date().toISOString(),
    }
  }

  @Public()
  @Get('simple-test')
  simpleTest() {
    console.log('🚀>>> simple-test endpoint called')
    return {
      message: 'Este endpoint no requiere autenticación',
      timestamp: new Date().toISOString(),
    }
  }
}
