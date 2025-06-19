import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration202506112028021749684482628 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user", new TableColumn({
            name: "active",
            type: "int",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "active");
    }

}
