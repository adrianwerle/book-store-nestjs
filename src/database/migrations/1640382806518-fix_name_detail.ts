import {MigrationInterface, QueryRunner} from "typeorm";

export class fixNameDetail1640382806518 implements MigrationInterface {
    name = 'fixNameDetail1640382806518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "name" SET NOT NULL`);
    }

}
