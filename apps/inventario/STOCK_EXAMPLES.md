# Ejemplos Prácticos de Gestión de Stock

## Escenario 1: Compra de Productos

### Situación Inicial

- Producto ID: 1 (Laptop Dell)
- Bodega ID: 1 (Bodega Principal)
- Stock Actual: 0
- Stock Disponible: 0

### Operación: Compra de 50 laptops

```http
POST /movimientos
Content-Type: application/json

{
  "codigo": "COMP-001",
  "tipo": "COMPRA",
  "productoId": 1,
  "cantidad": 50,
  "bodegaDestinoId": 1,
  "precioUnitario": 1200.00,
  "fechaMovimiento": "2024-01-15",
  "observaciones": "Compra de laptops Dell"
}
```

### Resultado

- **Stock Actualizado Automáticamente:**
  - Stock Actual: 50
  - Stock Disponible: 50
  - Stock Reservado: 0
  - Precio Promedio: 1200.00
  - Precio Último: 1200.00

## Escenario 2: Venta de Productos

### Situación Inicial

- Producto ID: 1 (Laptop Dell)
- Bodega ID: 1 (Bodega Principal)
- Stock Actual: 50
- Stock Disponible: 50

### Operación: Venta de 10 laptops

```http
POST /movimientos
Content-Type: application/json

{
  "codigo": "VENT-001",
  "tipo": "VENTA",
  "productoId": 1,
  "cantidad": 10,
  "bodegaOrigenId": 1,
  "fechaMovimiento": "2024-01-16",
  "observaciones": "Venta a cliente ABC"
}
```

### Resultado

- **Stock Actualizado Automáticamente:**
  - Stock Actual: 40
  - Stock Disponible: 40
  - Stock Reservado: 0

## Escenario 3: Transferencia entre Bodegas

### Situación Inicial

- Producto ID: 1 (Laptop Dell)
- Bodega ID: 1 (Bodega Principal): Stock = 40
- Bodega ID: 2 (Bodega Secundaria): Stock = 0

### Operación: Transferir 15 laptops de Bodega Principal a Bodega Secundaria

```http
POST /movimientos
Content-Type: application/json

{
  "codigo": "TRANS-001",
  "tipo": "TRANSFERENCIA",
  "productoId": 1,
  "cantidad": 15,
  "bodegaOrigenId": 1,
  "bodegaDestinoId": 2,
  "fechaMovimiento": "2024-01-17",
  "observaciones": "Transferencia para distribución"
}
```

### Resultado

- **Bodega Principal (ID: 1):**
  - Stock Actual: 25
  - Stock Disponible: 25

- **Bodega Secundaria (ID: 2):**
  - Stock Actual: 15
  - Stock Disponible: 15

## Escenario 4: Ajuste de Inventario

### Situación Inicial

- Producto ID: 1 (Laptop Dell)
- Bodega ID: 1 (Bodega Principal)
- Stock Actual: 25

### Operación: Ajuste por inventario físico (se encontraron 3 laptops más)

```http
POST /movimientos
Content-Type: application/json

{
  "codigo": "AJUST-001",
  "tipo": "AJUSTE",
  "productoId": 1,
  "cantidad": 28,
  "bodegaDestinoId": 1,
  "fechaMovimiento": "2024-01-18",
  "observaciones": "Ajuste por inventario físico - se encontraron 3 laptops adicionales"
}
```

### Resultado

- **Stock Actualizado Automáticamente:**
  - Stock Actual: 28 (establece la cantidad exacta)
  - Stock Disponible: 28

## Escenario 5: Error - Stock Insuficiente

### Situación Inicial

- Producto ID: 1 (Laptop Dell)
- Bodega ID: 1 (Bodega Principal)
- Stock Actual: 28
- Stock Disponible: 28

### Operación: Intentar vender 30 laptops (más de las disponibles)

```http
POST /movimientos
Content-Type: application/json

{
  "codigo": "VENT-002",
  "tipo": "VENTA",
  "productoId": 1,
  "cantidad": 30,
  "bodegaOrigenId": 1,
  "fechaMovimiento": "2024-01-19"
}
```

### Resultado

- **Error:** `BadRequestException`
- **Mensaje:** "Stock insuficiente. Disponible: 28, Solicitado: 30"
- **Movimiento:** No se crea
- **Stock:** No se modifica

## Escenario 6: Reserva de Stock

### Situación Inicial

- Producto ID: 1 (Laptop Dell)
- Bodega ID: 1 (Bodega Principal)
- Stock Actual: 28
- Stock Disponible: 28

### Operación: Reservar 5 laptops para una orden pendiente

```typescript
await stockService.reserveStock(1, 1, 5)
```

### Resultado

- **Stock Actualizado:**
  - Stock Actual: 28 (sin cambios)
  - Stock Disponible: 23 (28 - 5)
  - Stock Reservado: 5

### Operación: Confirmar la venta (consumir stock reservado)

```typescript
await stockService.consumeReservedStock(1, 1, 5)
```

### Resultado Final

- **Stock Actualizado:**
  - Stock Actual: 23 (28 - 5)
  - Stock Disponible: 23 (23 - 0)
  - Stock Reservado: 0 (5 - 5)

## Escenario 7: Verificación de Disponibilidad

### Operación: Verificar si hay stock suficiente para 20 laptops

```typescript
const disponibilidad = await stockService.checkStockAvailability(1, 1, 20)
```

### Resultado

```json
{
  "disponible": true,
  "stockActual": 23,
  "stockReservado": 0,
  "stockDisponible": 23,
  "mensaje": "Stock suficiente. Disponible: 23"
}
```

## Escenario 8: Stock Total por Producto

### Operación: Obtener stock total del producto en todas las bodegas

```typescript
const stockTotal = await stockService.getTotalStockByProduct(1)
```

### Resultado

```json
{
  "stockActual": 38,
  "stockReservado": 0,
  "stockDisponible": 38,
  "bodegas": [
    {
      "bodegaId": 1,
      "bodegaNombre": "Bodega Principal",
      "stockActual": 23,
      "stockReservado": 0,
      "stockDisponible": 23
    },
    {
      "bodegaId": 2,
      "bodegaNombre": "Bodega Secundaria",
      "stockActual": 15,
      "stockReservado": 0,
      "stockDisponible": 15
    }
  ]
}
```

## Puntos Clave

1. **Actualización Automática:** El stock se actualiza inmediatamente al crear cualquier movimiento
2. **Validaciones:** Se verifican las reglas de negocio antes de crear movimientos
3. **Consistencia:** El stock siempre refleja el estado real de los movimientos
4. **Flexibilidad:** Se pueden manejar diferentes tipos de operaciones (reserva, liberación, consumo)
5. **Trazabilidad:** Cada cambio de stock está asociado a un movimiento específico

