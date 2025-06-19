import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migration202506102001071749596467943 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: queryRunner.connection.driver.options.type === "sqlite" ? "integer" : "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "password",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "onCreated",
            type: queryRunner.connection.driver.options.type === "sqlite" ? "datetime" : "timestamp",
            default: queryRunner.connection.driver.options.type === "sqlite"
              ? "(datetime('now'))"
              : "now()",
          },
          {
            name: "onUpdated",
            type: queryRunner.connection.driver.options.type === "sqlite" ? "datetime" : "timestamp",
            default: queryRunner.connection.driver.options.type === "sqlite"
              ? "(datetime('now'))"
              : "now()",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user");
  }
}
