import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMetadataTable1762630433420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "main"."typeorm_metadata" (
                "type" varchar NOT NULL,
                "database" varchar DEFAULT NULL,
                "schema" varchar DEFAULT NULL,
                "table" varchar DEFAULT NULL,
                "name" varchar DEFAULT NULL,
                "value" text
            )
        `);
  }

  public async down(): Promise<void> {}
}
