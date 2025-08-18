import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMantenimientosTable1700000000002
  implements MigrationInterface
{
  name = 'CreateMantenimientosTable1700000000002'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla de mantenimientos
    await queryRunner.query(`
      CREATE TABLE "mantenimientos" (
        "id" SERIAL NOT NULL,
        "titulo" character varying(200) NOT NULL,
        "descripcion" text,
        "tipo" character varying(50) NOT NULL DEFAULT 'preventivo',
        "estado" character varying(50) NOT NULL DEFAULT 'programado',
        "prioridad" character varying(50) NOT NULL DEFAULT 'media',
        "equipo" character varying(100),
        "ubicacion" character varying(100),
        "responsable" character varying(100),
        "proveedor" character varying(100),
        "costoEstimado" decimal(10,2),
        "costoReal" decimal(10,2),
        "fechaProgramada" TIMESTAMP NOT NULL,
        "fechaInicio" TIMESTAMP,
        "fechaFin" TIMESTAMP,
        "duracionEstimada" integer,
        "duracionReal" integer,
        "observaciones" text,
        "materiales" text,
        "herramientas" text,
        "requiereRepuestos" boolean NOT NULL DEFAULT false,
        "repuestosUtilizados" text,
        "requiereAprobacion" boolean NOT NULL DEFAULT false,
        "aprobadoPor" character varying(100),
        "fechaAprobacion" TIMESTAMP,
        "enviarRecordatorio" boolean NOT NULL DEFAULT false,
        "diasRecordatorio" integer,
        "ultimoRecordatorio" TIMESTAMP,
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_mantenimientos" PRIMARY KEY ("id")
      )
    `)

    // Crear índices para mejorar el rendimiento
    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_estado" ON "mantenimientos" ("estado")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_tipo" ON "mantenimientos" ("tipo")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_prioridad" ON "mantenimientos" ("prioridad")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_fecha_programada" ON "mantenimientos" ("fechaProgramada")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_equipo" ON "mantenimientos" ("equipo")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_responsable" ON "mantenimientos" ("responsable")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_proveedor" ON "mantenimientos" ("proveedor")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_activo" ON "mantenimientos" ("activo")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_enviar_recordatorio" ON "mantenimientos" ("enviarRecordatorio")
    `)

    // Crear índices compuestos para consultas frecuentes
    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_estado_fecha" ON "mantenimientos" ("estado", "fechaProgramada")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_equipo_fecha" ON "mantenimientos" ("equipo", "fechaProgramada")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_mantenimientos_responsable_fecha" ON "mantenimientos" ("responsable", "fechaProgramada")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices compuestos
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_responsable_fecha"`)
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_equipo_fecha"`)
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_estado_fecha"`)

    // Eliminar índices simples
    await queryRunner.query(
      `DROP INDEX "IDX_mantenimientos_enviar_recordatorio"`,
    )
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_activo"`)
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_proveedor"`)
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_responsable"`)
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_equipo"`)
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_fecha_programada"`)
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_prioridad"`)
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_tipo"`)
    await queryRunner.query(`DROP INDEX "IDX_mantenimientos_estado"`)

    // Eliminar tabla
    await queryRunner.query(`DROP TABLE "mantenimientos"`)
  }
}
