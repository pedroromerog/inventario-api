import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProveedoresTable1700000000001 implements MigrationInterface {
  name = 'CreateProveedoresTable1700000000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla de proveedores
    await queryRunner.query(`
      CREATE TABLE "proveedores" (
        "id" SERIAL NOT NULL,
        "nombre" character varying(100) NOT NULL,
        "descripcion" character varying(200),
        "contacto" character varying(100),
        "telefono" character varying(100),
        "email" character varying(100),
        "direccion" character varying(200),
        "ciudad" character varying(50),
        "estado" character varying(50),
        "codigoPostal" character varying(20),
        "pais" character varying(50),
        "rfc" character varying(50),
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_proveedores_nombre" UNIQUE ("nombre"),
        CONSTRAINT "PK_proveedores" PRIMARY KEY ("id")
      )
    `)

    // Crear índices para mejorar el rendimiento
    await queryRunner.query(`
      CREATE INDEX "IDX_proveedores_activo" ON "proveedores" ("activo")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_proveedores_email" ON "proveedores" ("email")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_proveedores_rfc" ON "proveedores" ("rfc")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`DROP INDEX "IDX_proveedores_rfc"`)
    await queryRunner.query(`DROP INDEX "IDX_proveedores_email"`)
    await queryRunner.query(`DROP INDEX "IDX_proveedores_activo"`)

    // Eliminar tabla
    await queryRunner.query(`DROP TABLE "proveedores"`)
  }
}
