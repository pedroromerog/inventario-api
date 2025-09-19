import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import type { Request as ExpressRequest, Response } from 'express'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current-user.decorator'
import { Public } from './decorators/public.decorator'
import { AuthResponseDto } from './dto/auth-response.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

interface RequestWithCookies extends ExpressRequest {
  cookies: Record<string, string>
}

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: 400,
    description: 'Usuario inactivo',
  })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      // Validar credenciales del usuario
      await this.validateUserCredentials(loginDto)

      // Realizar login y obtener respuesta
      const authResponse = await this.authService.login(loginDto)
      // return authResponse

      // Guardar accessToken como cookie HttpOnly
      res.cookie('access_token', authResponse.accessToken, {
        httpOnly: true,
        secure: true, // usa true en producción con HTTPS
        sameSite: 'strict',
        maxAge: authResponse.expiresIn * 1000, // según expiresIn
      })

      // Guardar refreshToken como cookie HttpOnly
      res.cookie('refresh_token', authResponse.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      })

      // Responder solo con datos del usuario
      return res.send({ user: authResponse.user })
    } catch (error) {
      console.error('Error', error)
      throw error
    }
  }

  /**
   * Valida las credenciales del usuario
   * @param loginDto Datos de login
   * @returns Usuario validado
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  private async validateUserCredentials(loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    )

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas')
    }
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  async refreshToken(
    @Request() request: RequestWithCookies,
    @Res() res: Response,
  ) {
    // Extraer refresh token desde cookies
    const refreshToken = request.cookies.refresh_token
    if (!refreshToken) {
      throw new Error('Refresh token no encontrado en cookies')
    }

    const refreshTokenDto = { refreshToken }
    const data = await this.authService.refreshToken(refreshTokenDto)
    res.cookie('access_token', data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: data.expiresIn * 1000,
    })
    return res.send({ message: 'Access token refreshed' })
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión de usuario' })
  logout(@CurrentUser('id') userId: string, @Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })

    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })

    return res.status(200).json({ message: 'Sesión cerrada correctamente' })
    // return this.authService.logout(userId)
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña del usuario' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(userId, changePasswordDto)
    return { message: 'Contraseña cambiada exitosamente' }
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  async getProfile(
    @CurrentUser('id') userId: string,
  ): Promise<Record<string, unknown>> {
    return this.authService.getProfile(userId)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado (GET)' })
  async getProfileGet(
    @CurrentUser('id') userId: string,
  ): Promise<Record<string, unknown>> {
    return this.authService.getProfile(userId)
  }

  @Get('verify-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar validez del token' })
  verifyToken(@CurrentUser() user: Record<string, unknown>) {
    return { valid: true, user }
  }
}
