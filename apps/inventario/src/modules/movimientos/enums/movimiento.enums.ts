export enum TipoMovimiento {
  ENTRADA = 'entrada',
  SALIDA = 'salida',
  TRANSFERENCIA = 'transferencia',
  AJUSTE = 'ajuste',
  DEVOLUCION = 'devolucion',
  MERMA = 'merma',
  VENTA = 'venta',
  COMPRA = 'compra',
  PRODUCCION = 'produccion',
  CONSUMO = 'consumo',
  OTRO = 'otro',
}

export enum EstadoMovimiento {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
  RECHAZADO = 'rechazado',
  EN_REVISION = 'en_revision',
}

export enum MotivoMovimiento {
  INVENTARIO_INICIAL = 'inventario_inicial',
  COMPRA_PROVEEDOR = 'compra_proveedor',
  VENTA_CLIENTE = 'venta_cliente',
  TRANSFERENCIA_BODEGA = 'transferencia_bodega',
  AJUSTE_INVENTARIO = 'ajuste_inventario',
  MERMA_PRODUCCION = 'merma_produccion',
  DEVOLUCION_CLIENTE = 'devolucion_cliente',
  DEVOLUCION_PROVEEDOR = 'devolucion_proveedor',
  PRODUCCION_INTERNA = 'produccion_interna',
  CONSUMO_INTERNO = 'consumo_interno',
  MANTENIMIENTO = 'mantenimiento',
  CALIBRACION = 'calibracion',
  REPARACION = 'reparacion',
  LIMPIEZA = 'limpieza',
  INSPECCION = 'inspeccion',
  OTRO = 'otro',
}
