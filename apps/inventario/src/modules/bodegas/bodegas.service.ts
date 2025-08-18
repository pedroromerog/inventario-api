import { Injectable } from '@nestjs/common'
import { CreateBodegaAction } from './use-case/create-bodega.usecase'
import { GetBodegaAction } from './use-case/get-bodega.usecase'
import { UpdateBodegaAction } from './use-case/update-bodega.usecase'
import { DeleteBodegaAction } from './use-case/delete-bodega.usecase'
import { BodegasRepository } from './repository/bodegas.repository'
import { CreateBodegaDto } from './dto/create-bodega.dto'
import { UpdateBodegaDto } from './dto/update-bodega.dto'
import { Bodega } from './entities/bodega.entity'
import { TipoBodega, EstadoBodega } from './enums/bodega.enums'

@Injectable()
export class BodegasService {
  constructor(
    private readonly createBodegaAction: CreateBodegaAction,
    private readonly getBodegaAction: GetBodegaAction,
    private readonly updateBodegaAction: UpdateBodegaAction,
    private readonly deleteBodegaAction: DeleteBodegaAction,
    private readonly bodegasRepository: BodegasRepository,
  ) {}

  async create(createBodegaDto: CreateBodegaDto): Promise<Bodega> {
    return this.createBodegaAction.execute(createBodegaDto)
  }

  async findAll(): Promise<Bodega[]> {
    return this.getBodegaAction.findAll()
  }

  async findOne(id: number): Promise<Bodega> {
    return this.getBodegaAction.findById(id)
  }

  async findByCodigo(codigo: string): Promise<Bodega> {
    return this.getBodegaAction.findByCodigo(codigo)
  }

  async findByTipo(tipo: TipoBodega): Promise<Bodega[]> {
    return this.getBodegaAction.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoBodega): Promise<Bodega[]> {
    return this.getBodegaAction.findByEstado(estado)
  }

  async findByCiudad(ciudad: string): Promise<Bodega[]> {
    return this.getBodegaAction.findByCiudad(ciudad)
  }

  async findByResponsable(responsableId: string): Promise<Bodega[]> {
    return this.getBodegaAction.findByResponsable(responsableId)
  }

  async searchByTerm(term: string): Promise<Bodega[]> {
    return this.getBodegaAction.searchByTerm(term)
  }

  async update(id: number, updateBodegaDto: UpdateBodegaDto): Promise<Bodega> {
    return this.updateBodegaAction.execute(id, updateBodegaDto)
  }

  async remove(id: number): Promise<void> {
    return this.deleteBodegaAction.execute(id)
  }

  async restore(id: number): Promise<void> {
    return this.deleteBodegaAction.restore(id)
  }

  async hardRemove(id: number): Promise<void> {
    return this.deleteBodegaAction.hardDelete(id)
  }
}
