import { DataSource } from 'typeorm'
import { hash } from 'bcrypt'
import { User } from '../../modules/users/entities/user.entity'
import { Rol } from '../../modules/roles/entities/rol.entity'
import { seedProveedores } from './proveedores-seed'
import { seedRoles } from './roles-seed'

export class InitialSeed {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    console.log('🌱 Iniciando seeding de datos...')

    // Crear roles primero
    await seedRoles(this.dataSource)

    // Obtener roles para asignar a usuarios
    const adminRole = await this.dataSource.manager.findOne(Rol, {
      where: { codigo: 'ADMIN' },
    })
    const operatorRole = await this.dataSource.manager.findOne(Rol, {
      where: { codigo: 'OPERADOR' },
    })

    if (!adminRole || !operatorRole) {
      throw new Error('No se pudieron encontrar los roles necesarios')
    }

    // Crear usuario administrador
    const adminUser = new User()
    adminUser.username = 'admin'
    adminUser.email = 'admin@inventario.com'
    adminUser.password = await hash('admin123', 10)
    adminUser.nombre = 'Administrador'
    adminUser.apellido = 'Sistema'
    adminUser.rolId = adminRole.id
    adminUser.estado = 'activo' as any
    adminUser.isActive = true

    await this.dataSource.manager.save(adminUser)
    console.log('✅ Usuario administrador creado')

    // Crear usuario regular
    const regularUser = new User()
    regularUser.username = 'user'
    regularUser.email = 'user@inventario.com'
    regularUser.password = await hash('user123', 10)
    regularUser.nombre = 'Usuario'
    regularUser.apellido = 'Regular'
    regularUser.rolId = operatorRole.id
    regularUser.estado = 'activo' as any
    regularUser.isActive = true

    await this.dataSource.manager.save(regularUser)
    console.log('✅ Usuario regular creado')

    // Crear proveedores de ejemplo
    await seedProveedores(this.dataSource)

    console.log('🎉 Seeding completado exitosamente')
  }
}
