import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common'
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { Roles } from './decorators/roles.decorator'
import { Public } from './decorators/public.decorator'
import { CurrentUser } from './decorators/current-user.decorator'

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  async login(@Body() loginDto: LoginDto, @CurrentUser() user: any) {
    return this.authService.login(loginDto)
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión de usuario' })
  async logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId)
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña del usuario' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(userId, changePasswordDto)
    return { message: 'Contraseña cambiada exitosamente' }
  }

  @Get('verify-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar validez del token' })
  async verifyToken(@Request() req: any) {
    return { valid: true, user: req.user }
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Endpoint solo para administradores' })
  async adminOnly(@CurrentUser() user: any) {
    return { message: 'Acceso permitido solo para administradores', user }
  }

  @Get('supervisor-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Endpoint para administradores y supervisores' })
  async supervisorOnly(@CurrentUser() user: any) {
    return {
      message: 'Acceso permitido para administradores y supervisores',
      user,
    }
  }
}
