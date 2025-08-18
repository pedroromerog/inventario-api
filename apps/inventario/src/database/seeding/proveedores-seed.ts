import { DataSource } from 'typeorm'
import { Proveedor } from '../../modules/proveedores/entities/proveedor.entity'
import {
  TipoProveedor,
  EstadoProveedor,
} from '../../modules/proveedores/enums/proveedor.enums'

export const seedProveedores = async (
  dataSource: DataSource,
): Promise<void> => {
  const proveedoresRepository = dataSource.getRepository(Proveedor)

  // Verificar si ya existen proveedores
  const existingProveedores = await proveedoresRepository.count()
  if (existingProveedores > 0) {
    console.log('Proveedores ya existen, saltando seed...')
    return
  }

  const proveedoresData = [
    {
      nombre: 'Distribuidora Industrial S.A.',
      descripcion:
        'Proveedor líder en herramientas industriales y equipos de seguridad',
      tipo: TipoProveedor.PRODUCTOS,
      estado: EstadoProveedor.ACTIVO,
      contacto: 'Juan Pérez',
      telefono: '+52 55 1234 5678',
      email: 'ventas@distribuidoraindustrial.com',
      direccion: 'Av. Industrial 123',
      ciudad: 'Monterrey',
      departamento: 'Nuevo León',
      codigoPostal: '64000',
      pais: 'México',
      rfc: 'DIS123456789',
      isActive: true,
    },
    {
      nombre: 'Suministros Tecnológicos del Norte',
      descripcion: 'Especialistas en equipos de cómputo y tecnología',
      tipo: TipoProveedor.TECNOLOGIA,
      estado: EstadoProveedor.ACTIVO,
      contacto: 'María González',
      telefono: '+52 81 9876 5432',
      email: 'info@suministrosnorte.com',
      direccion: 'Blvd. Tecnológico 456',
      ciudad: 'Guadalajara',
      departamento: 'Jalisco',
      codigoPostal: '44100',
      pais: 'México',
      rfc: 'STN987654321',
      isActive: true,
    },
    {
      nombre: 'Materiales de Construcción Express',
      descripcion: 'Materiales de construcción de alta calidad',
      tipo: TipoProveedor.MATERIALES,
      estado: EstadoProveedor.ACTIVO,
      contacto: 'Carlos Rodríguez',
      telefono: '+52 33 5555 1234',
      email: 'pedidos@materialesexpress.com',
      direccion: 'Calle Constructor 789',
      ciudad: 'Puebla',
      departamento: 'Puebla',
      codigoPostal: '72000',
      pais: 'México',
      rfc: 'MCE456789123',
      isActive: true,
    },
    {
      nombre: 'Equipos Médicos Profesionales',
      descripcion: 'Equipos médicos y suministros hospitalarios',
      tipo: TipoProveedor.EQUIPOS,
      estado: EstadoProveedor.ACTIVO,
      contacto: 'Dra. Ana Martínez',
      telefono: '+52 55 8765 4321',
      email: 'ventas@equiposmedicos.com',
      direccion: 'Av. Médica 321',
      ciudad: 'Querétaro',
      departamento: 'Querétaro',
      codigoPostal: '76000',
      pais: 'México',
      rfc: 'EMP789123456',
      isActive: true,
    },
    {
      nombre: 'Papelería y Oficina Central',
      descripcion: 'Suministros de oficina y papelería',
      tipo: TipoProveedor.PRODUCTOS,
      estado: EstadoProveedor.ACTIVO,
      contacto: 'Roberto Silva',
      telefono: '+52 81 1111 2222',
      email: 'pedidos@papeleriaoficina.com',
      direccion: 'Calle Oficina 654',
      ciudad: 'San Luis Potosí',
      departamento: 'San Luis Potosí',
      codigoPostal: '78000',
      pais: 'México',
      rfc: 'POC222333444',
      isActive: true,
    },
  ]

  try {
    for (const proveedorData of proveedoresData) {
      const proveedor = proveedoresRepository.create(proveedorData)
      await proveedoresRepository.save(proveedor)
    }

    console.log(`${proveedoresData.length} proveedores creados exitosamente`)
  } catch (error) {
    console.error('Error al crear proveedores:', error)
    throw error
  }
}
