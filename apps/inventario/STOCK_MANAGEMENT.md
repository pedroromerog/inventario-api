# Sistema de Gestión de Stock Automática

## Descripción General

El sistema de gestión de stock automática se encarga de actualizar automáticamente las cantidades de stock cuando se crean o actualizan movimientos de inventario. Esto garantiza que el stock siempre esté sincronizado con los movimientos registrados.

## Funcionalidades Implementadas

### 1. Gestión Automática de Stock en Movimientos

#### Tipos de Movimientos Soportados

**Movimientos de Entrada:**

- `ENTRADA`: Entrada general de productos
- `COMPRA`: Compra de productos a proveedores
- `PRODUCCION`: Producción interna de productos
- `DEVOLUCION`: Devolución de productos

**Movimientos de Salida:**

- `SALIDA`: Salida general de productos
- `VENTA`: Venta de productos a clientes
- `CONSUMO`: Consumo interno de productos
- `MERMA`: Pérdida o merma de productos

**Movimientos Especiales:**

- `TRANSFERENCIA`: Transferencia entre bodegas
- `AJUSTE`: Ajuste de inventario (establece cantidad exacta)

#### Comportamiento del Sistema

1. **Al crear un movimiento:**
   - Se validan las reglas de negocio específicas por tipo
   - Se verifica disponibilidad de stock para movimientos de salida
   - Se crea el movimiento en estado `PENDIENTE` por defecto
   - **Se actualiza el stock automáticamente inmediatamente** al crear el movimiento

2. **Al actualizar el estado de un movimiento:**
   - Se valida la transición de estado
   - Solo se actualiza el stock nuevamente si el movimiento cambia de un estado no completado a `COMPLETADO`
   - Si hay errores en la actualización del stock, el movimiento se marca como `EN_REVISION`

### 2. Operaciones de Stock

#### Reserva de Stock

```typescript
await stockService.reserveStock(productoId, bodegaId, cantidad)
```

- Reserva una cantidad específica de stock
- Reduce el stock disponible pero mantiene el stock actual
- Útil para órdenes de venta pendientes

#### Liberación de Stock

```typescript
await stockService.releaseStock(productoId, bodegaId, cantidad)
```

- Libera stock previamente reservado
- Aumenta el stock disponible
- Útil cuando se cancela una orden

#### Consumo de Stock Reservado

```typescript
await stockService.consumeReservedStock(productoId, bodegaId, cantidad)
```

- Convierte stock reservado en salida real
- Reduce tanto el stock actual como el reservado
- Útil cuando se confirma una venta

#### Verificación de Disponibilidad

```typescript
const disponibilidad = await stockService.checkStockAvailability(
  productoId,
  bodegaId,
  cantidad,
)
```

- Verifica si hay stock suficiente para una operación
- Retorna información detallada del stock actual

### 3. Cálculo de Precios

#### Precio Promedio Ponderado

Para movimientos de entrada con precio unitario:

- Se calcula el precio promedio ponderado basado en el stock actual y el nuevo stock
- Fórmula: `(valorActual + valorNuevo) / stockTotal`

#### Precio Último

- Se actualiza con el precio del último movimiento de entrada
- Se mantiene independiente del precio promedio

## API Endpoints

### Movimientos

#### Crear Movimiento

```http
POST /movimientos
Content-Type: application/json

{
  "codigo": "MOV001",
  "tipo": "ENTRADA",
  "productoId": 1,
  "cantidad": 100,
  "bodegaDestinoId": 1,
  "precioUnitario": 25.50,
  "fechaMovimiento": "2024-01-15"
}
```

#### Actualizar Estado de Movimiento

```http
PATCH /movimientos/{id}/estado
Content-Type: application/json

{
  "estado": "COMPLETADO",
  "observaciones": "Movimiento completado exitosamente"
}
```

### Stock

#### Verificar Disponibilidad

```http
GET /stock/verificar-disponibilidad?productoId=1&bodegaId=1&cantidad=50
```

#### Obtener Stock Total por Producto

```http
GET /stock/producto/{productoId}/total
```

## Validaciones Implementadas

### Validaciones de Movimientos

1. **Cantidad positiva:** Todos los movimientos deben tener cantidad > 0
2. **Transferencias:** Requieren bodega origen y destino diferentes
3. **Salidas:** Verifican disponibilidad de stock antes de permitir el movimiento
4. **Entradas:** Requieren bodega destino válida

### Validaciones de Stock

1. **Stock insuficiente:** No permite salidas que excedan el stock disponible
2. **Stock negativo:** Previene que el stock actual sea negativo
3. **Reservas:** No permite reservar más stock del disponible

## Estados de Movimientos

- `PENDIENTE`: Movimiento creado pero no procesado
- `EN_PROCESO`: Movimiento en proceso de ejecución
- `COMPLETADO`: Movimiento completado y stock actualizado
- `CANCELADO`: Movimiento cancelado
- `RECHAZADO`: Movimiento rechazado
- `EN_REVISION`: Movimiento requiere revisión (generalmente por errores)

## Transiciones de Estado Válidas

```
PENDIENTE → EN_PROCESO, COMPLETADO, CANCELADO, RECHAZADO
EN_PROCESO → COMPLETADO, CANCELADO, EN_REVISION
EN_REVISION → COMPLETADO, CANCELADO, EN_PROCESO
RECHAZADO → PENDIENTE, CANCELADO
COMPLETADO → (no se puede cambiar)
CANCELADO → (no se puede cambiar)
```

## Manejo de Errores

### Errores de Stock

- Si hay error actualizando el stock, el movimiento se marca como `EN_REVISION`
- Se registra el error en las observaciones del movimiento
- El sistema mantiene la integridad de los datos

### Errores de Validación

- Se lanzan excepciones específicas con mensajes descriptivos
- Se previene la creación de movimientos inválidos
- Se mantiene la consistencia del sistema

## Consideraciones de Rendimiento

1. **Transacciones:** Las operaciones de stock se ejecutan en transacciones para mantener consistencia
2. **Validaciones:** Se realizan validaciones antes de actualizar el stock
3. **Índices:** Se utilizan índices en las consultas de stock para mejorar el rendimiento
4. **Caché:** Las consultas frecuentes pueden ser cacheadas según sea necesario

## Extensibilidad

El sistema está diseñado para ser extensible:

1. **Nuevos tipos de movimiento:** Se pueden agregar fácilmente nuevos tipos
2. **Nuevas operaciones de stock:** Se pueden implementar nuevas operaciones
3. **Integración con otros módulos:** El servicio de stock puede ser utilizado por otros módulos
4. **Webhooks:** Se pueden agregar webhooks para notificar cambios de stock

## Ejemplos de Uso

### Flujo de Compra

1. Crear movimiento tipo `COMPRA` en estado `PENDIENTE` → **Stock se actualiza automáticamente**
2. Actualizar estado a `EN_PROCESO` cuando se recibe la mercancía → No se actualiza stock
3. Actualizar estado a `COMPLETADO` → No se actualiza stock (ya se actualizó al crear)

### Flujo de Venta

1. Reservar stock para la orden
2. Crear movimiento tipo `VENTA` en estado `PENDIENTE` → **Stock se actualiza automáticamente**
3. Actualizar estado a `COMPLETADO` → No se actualiza stock (ya se actualizó al crear)

### Flujo de Transferencia

1. Crear movimiento tipo `TRANSFERENCIA` con bodega origen y destino → **Stock se actualiza automáticamente**
2. Actualizar estado a `COMPLETADO` → No se actualiza stock (ya se actualizó al crear)

## Comportamiento de Actualización de Stock

### Actualización Inmediata

- **Todos los movimientos actualizan el stock inmediatamente al ser creados**
- Esto garantiza que el stock siempre esté sincronizado con los movimientos registrados
- No importa el estado inicial del movimiento (PENDIENTE, EN_PROCESO, etc.)

### Prevención de Doble Actualización

- Si un movimiento se crea en estado `COMPLETADO`, el stock se actualiza una sola vez
- Si un movimiento se crea en otro estado y luego se cambia a `COMPLETADO`, no se actualiza el stock nuevamente
- Esto evita inconsistencias y duplicaciones en el stock

### Validaciones Previas

- Antes de crear un movimiento de salida, se verifica que haya stock suficiente
- Si no hay stock suficiente, el movimiento no se crea y se lanza una excepción
- Esto previene movimientos que no se pueden cumplir
