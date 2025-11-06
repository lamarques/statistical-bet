import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateDrawsTable1699999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'draws',
        columns: [
          {
            name: 'contestNumber',
            type: 'int',
            isPrimary: true,
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'drawDate',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'numbers',
            type: 'text',
            isNullable: false,
            comment: 'Comma-separated list of numbers',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create index on contestNumber (unique)
    await queryRunner.createIndex(
      'draws',
      new TableIndex({
        name: 'IDX_DRAWS_CONTEST_NUMBER',
        columnNames: ['contestNumber'],
        isUnique: true,
      })
    );

    // Create index on drawDate for date-based queries
    await queryRunner.createIndex(
      'draws',
      new TableIndex({
        name: 'IDX_DRAWS_DRAW_DATE',
        columnNames: ['drawDate'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('draws', 'IDX_DRAWS_DRAW_DATE');
    await queryRunner.dropIndex('draws', 'IDX_DRAWS_CONTEST_NUMBER');
    await queryRunner.dropTable('draws');
  }
}
