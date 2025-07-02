import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Migration202506281618011751138282075 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "usersCompanies",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true, 
                        generationStrategy: "increment",
                    },
                    {
                        name: "idCompany",
                        type: "int", 
                        isNullable: false,
                    },
                    {
                        name: "idUser",
                        type: "int", 
                        isNullable: false,
                    },
                    {
                        name: "active",
                        type: "int",
                        default: 1, 
                        isNullable: false,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "usersCompanies",
            new TableForeignKey({
                columnNames: ["idCompany"],
                referencedColumnNames: ["id"],
                referencedTableName: "companies",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "usersCompanies",
            new TableForeignKey({
                columnNames: ["idUser"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("usersCompanies");

        const foreignKeyCompany = table!.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("idCompany") !== -1,
        );
        if (foreignKeyCompany) {
            await queryRunner.dropForeignKey("usersCompanies", foreignKeyCompany);
        }

        const foreignKeyUser = table!.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("idUser") !== -1,
        );
        if (foreignKeyUser) {
            await queryRunner.dropForeignKey("usersCompanies", foreignKeyUser);
        }

        await queryRunner.dropTable("usersCompanies");
    }
}