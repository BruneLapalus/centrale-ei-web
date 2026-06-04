/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class  $npmConfigName1780591963802 {
    name = ' $npmConfigName1780591963802'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "password" varchar NOT NULL,
                "likedMovies" text,
                "dislikedMovies" text,
                "watchlist" text,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user"(
                    "id",
                    "email",
                    "firstname",
                    "lastname",
                    "password",
                    "likedMovies",
                    "dislikedMovies"
                )
            SELECT "id",
                "email",
                "firstname",
                "lastname",
                "password",
                "likedMovies",
                "dislikedMovies"
            FROM "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "password" varchar NOT NULL,
                "likedMovies" text,
                "dislikedMovies" text,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user"(
                    "id",
                    "email",
                    "firstname",
                    "lastname",
                    "password",
                    "likedMovies",
                    "dislikedMovies"
                )
            SELECT "id",
                "email",
                "firstname",
                "lastname",
                "password",
                "likedMovies",
                "dislikedMovies"
            FROM "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user"
        `);
    }
}
