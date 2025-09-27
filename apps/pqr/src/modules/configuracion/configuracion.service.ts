import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfiguracionEntidad } from './entities/configuracion.entity'
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto'

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(ConfiguracionEntidad)
    private readonly configuracionRepository: Repository<ConfiguracionEntidad>,
  ) {}

  async getConfiguracion(): Promise<ConfiguracionEntidad> {
    const configuracion = await this.configuracionRepository.findOne({
      where: {},
    })

    if (!configuracion) {
      throw new NotFoundException('No se encontró la configuración del sistema')
    }

    return configuracion
  }

  async updateConfiguracion(
    updateConfiguracionDto: UpdateConfiguracionDto,
  ): Promise<ConfiguracionEntidad> {
    const configuracion = await this.configuracionRepository.findOne({
      where: {},
    })

    if (!configuracion) {
      throw new NotFoundException('No se encontró la configuración del sistema')
    }

    Object.assign(configuracion, updateConfiguracionDto)
    configuracion.updatedAt = new Date()

    return this.configuracionRepository.save(configuracion)
  }
}
