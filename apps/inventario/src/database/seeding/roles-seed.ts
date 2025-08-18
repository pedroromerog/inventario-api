import { DataSource } from 'typeorm'
import { Rol } from '../../modules/roles/entities/rol.entity'

export async function seedRoles(dataSource: DataSource): Promise<void> {
  console.log('🌱 Creando roles...')

  const rolesData = [
    {
      codigo: 'ADMIN',
      nombre: 'Administrador',
      isActive: true,
    },
    {
      codigo: 'SUPERVISOR',
      nombre: 'Supervisor',
      isActive: true,
    },
    {
      codigo: 'OPERADOR',
      nombre: 'Operador',
      isActive: true,
    },
    {
      codigo: 'AUDITOR',
      nombre: 'Auditor',
      isActive: true,
    },
    {
      codigo: 'VISUALIZADOR',
      nombre: 'Visualizador',
      isActive: true,
    },
  ]

  for (const roleData of rolesData) {
    const existingRole = await dataSource.manager.findOne(Rol, {
      where: { codigo: roleData.codigo },
    })

    if (!existingRole) {
      const role = new Rol()
      Object.assign(role, roleData)
      await dataSource.manager.save(role)
      console.log(`✅ Rol ${roleData.codigo} creado`)
    } else {
      console.log(`ℹ️ Rol ${roleData.codigo} ya existe`)
    }
  }

  console.log('✅ Roles creados exitosamente')
}
