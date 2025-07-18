import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration202507100826231752146783810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "companies",
      new TableColumn({
        name: "number",
        type: "varchar",
        length: "20",
        isNullable: true, // Se quiser permitir número vazio
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("companies", "number");
  }
}
