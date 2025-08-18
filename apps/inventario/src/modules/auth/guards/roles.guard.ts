import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()
    // Verificar si el usuario tiene un rol y si el código del rol está en los roles requeridos
    return requiredRoles.some(
      (roleCode) => user.rol && user.rol.codigo === roleCode,
    )
  }
}
