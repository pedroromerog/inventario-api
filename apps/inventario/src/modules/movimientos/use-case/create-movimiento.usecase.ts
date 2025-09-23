import { Injectable, ConflictException } from '@nestjs/common'
import { MovimientosRepository } from '../repository/movimientos.repository'
import { CreateMovimientoDto } from '../dto/create-movimiento.dto'
import { Movimiento } from '../entities/movimiento.entity'
import { TipoMovimiento, TipoOperacion } from '../enums/movimiento.enums'

@Injectable()
export class CreateMovimientoAction {
  constructor(private readonly movimientosRepository: MovimientosRepository) {}

  async execute(createMovimientoDto: CreateMovimientoDto): Promise<Movimiento> {
    // Verificar que el código no exista
    const existingByCodigo = await this.movimientosRepository.findByCodigo(
      createMovimientoDto.codigo,
    )
    if (existingByCodigo) {
      throw new ConflictException(
        `Ya existe un movimiento con el código ${createMovimientoDto.codigo}`,
      )
    }

    const entradas = [
      TipoMovimiento.ENTRADA,
      TipoMovimiento.COMPRA,
      TipoMovimiento.PRODUCCION,
    ]
    const salidas = [
      TipoMovimiento.SALIDA,
      TipoMovimiento.VENTA,
      TipoMovimiento.CONSUMO,
      TipoMovimiento.MERMA,
    ]
    // Validar que si es una salida, tenga bodegaDestinoId null
    if (salidas.includes(createMovimientoDto.tipo as TipoMovimiento)) {
      createMovimientoDto.operacion = TipoOperacion.SALIDA
    } else if (entradas.includes(createMovimientoDto.tipo as TipoMovimiento)) {
      createMovimientoDto.operacion = TipoOperacion.ENTRADA
    } else {
      createMovimientoDto.operacion = TipoOperacion.SALIDA
    }

    // Crear el movimiento
    return this.movimientosRepository.createMovimiento(createMovimientoDto)
  }
}
