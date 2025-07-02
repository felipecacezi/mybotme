import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migration202506281610311751137831507 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "companies",
        columns: [
          {
            name: "id",
            type: "int", 
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment", 
          },
          {
            name: "cnpj",
            type: "varchar",
            length: "18",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "street",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "district",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "city",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "state",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "country",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "zipcode",
            type: "varchar",
            length: "9",
            isNullable: true,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("companies");
  }
}