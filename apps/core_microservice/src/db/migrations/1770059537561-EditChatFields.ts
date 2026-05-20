import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditChatFields1770059537561 implements MigrationInterface {
  name = 'EditChatFields1770059537561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "main"."chats" ALTER COLUMN "name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "main"."chats" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
