import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator'
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsEnum(UserRole)
  rol: UserRole

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
