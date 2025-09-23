import { IsString, IsNotEmpty, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ChangePasswordDto {
  @ApiProperty({ description: 'Contraseña actual', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string

  @ApiProperty({ description: 'Nueva contraseña', example: 'newpassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  newPassword: string

  @ApiProperty({
    description: 'Confirmación de nueva contraseña',
    example: 'newpassword123',
  })
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string
}
