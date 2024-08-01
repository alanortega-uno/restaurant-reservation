import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1722439928348 implements MigrationInterface {
  name = "InitialMigration1722439928348";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`is_admin\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`reservation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`number_of_people\` int NOT NULL, \`status\` enum ('0', '1', '2') NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`account_id\` int NULL, \`table_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`table\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`capacity\` int NOT NULL, \`status\` enum ('0', '1', '2') NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_2cb0b78846e0a65d35a4cd02d3\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`refresh_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`account_id\` int NOT NULL, \`token\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`, \`account_id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_5f6547251f5c3fa14f5e3c8a008\` FOREIGN KEY (\`account_id\`) REFERENCES \`account\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_d3321fc44e70fd7e803491513d6\` FOREIGN KEY (\`table_id\`) REFERENCES \`table\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    // TEST ACCOUNT
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`account\` (\`email\`, \`password\`) VALUES (\'test@tests.com\', \'$2a$10$DhCLTt25RzksFFqjhPmLIu4HlJhWcUaY/UKlRhFIcyUQxcRyG7E6S\')`
    );
    // ADMIN
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`account\` (\`email\`, \`password\`, \`is_admin\`) VALUES (\'admin@admin.com\', \'$2a$10$TWzrd/KgHRLsRsWBDo2lyuSDBN1t8/5cJOoknPtiBFIuF72CZB1cu\', 1)`
    );
    // TABLES
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`table\` (\`name\`, \`capacity\`) VALUES (\'1\', 2)`
    );
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`table\` (\`name\`, \`capacity\`) VALUES (\'2\', 6)`
    );
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`table\` (\`name\`, \`capacity\`) VALUES (\'3\', 4)`
    );
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`table\` (\`name\`, \`capacity\`) VALUES (\'4\', 2)`
    );
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`table\` (\`name\`, \`capacity\`) VALUES (\'5\', 4)`
    );
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`table\` (\`name\`, \`capacity\`) VALUES (\'6\', 2)`
    );
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`table\` (\`name\`, \`capacity\`) VALUES (\'7\', 4)`
    );
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`table\` (\`name\`, \`capacity\`) VALUES (\'8\', 8)`
    );
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`table\` (\`name\`, \`capacity\`) VALUES (\'9\', 2)`
    );
    await queryRunner.query(
      `INSERT INTO \`restaurant_reservations\`.\`table\` (\`name\`, \`capacity\`) VALUES (\'10\', 8)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_d3321fc44e70fd7e803491513d6\``
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_5f6547251f5c3fa14f5e3c8a008\``
    );
    await queryRunner.query(`DROP TABLE \`refresh_token\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2cb0b78846e0a65d35a4cd02d3\` ON \`table\``
    );
    await queryRunner.query(`DROP TABLE \`table\``);
    await queryRunner.query(`DROP TABLE \`reservation\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` ON \`account\``
    );
    await queryRunner.query(`DROP TABLE \`account\``);
  }
}
