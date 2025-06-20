import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration202506161845291750110329858 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "jwt_token",
            type: "varchar",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "jwt_token");
    }

}
