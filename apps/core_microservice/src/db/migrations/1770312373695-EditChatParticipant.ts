import { MigrationInterface, QueryRunner } from "typeorm";

export class EditChatParticipant1770312373695 implements MigrationInterface {
    name = 'EditChatParticipant1770312373695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."chats_participants" ALTER COLUMN "joined_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "main"."chats_participants" ALTER COLUMN "joined_at" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."chats_participants" ALTER COLUMN "joined_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "main"."chats_participants" ALTER COLUMN "joined_at" SET NOT NULL`);
    }

}
