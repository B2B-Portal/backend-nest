import { MigrationInterface, QueryRunner } from "typeorm";

export class UserCityAddress1715604818717 implements MigrationInterface {
    name = 'UserCityAddress1715604818717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "city" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    }

}
