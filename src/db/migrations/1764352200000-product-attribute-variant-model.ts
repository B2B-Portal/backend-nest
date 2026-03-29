import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductAttributeVariantModel1764352200000
  implements MigrationInterface
{
  name = 'ProductAttributeVariantModel1764352200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN IF EXISTS "attributes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN IF EXISTS "variants"`,
    );

    await queryRunner.query(
      `CREATE TABLE "product_attribute" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'select', "isFilterable" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_8606a4bc1ce6e9771114f9d22e7" UNIQUE ("code"), CONSTRAINT "PK_5f1f85067bbfd7de4ea4a0c2fd6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_attribute_option" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, "label" character varying, "sortOrder" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "attribute_id" integer, CONSTRAINT "UQ_9e1fd15e9f7350c264f724adf7a" UNIQUE ("attribute_id", "value"), CONSTRAINT "PK_46078a7e0f458bc4f51ec8e771c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category_product_attribute" ("id" SERIAL NOT NULL, "required" boolean NOT NULL DEFAULT false, "useInVariants" boolean NOT NULL DEFAULT true, "filterable" boolean NOT NULL DEFAULT true, "sortOrder" integer NOT NULL DEFAULT '0', "category_id" integer, "attribute_id" integer, CONSTRAINT "UQ_0f92840f262c7dc26f45f3ca716" UNIQUE ("category_id", "attribute_id"), CONSTRAINT "PK_889c56c7f4f6dc6dfb03377f4f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variant" ("id" SERIAL NOT NULL, "sku" character varying, "price" numeric(10,2), "quantity" integer NOT NULL DEFAULT '0', "image" character varying, "product_id" integer, CONSTRAINT "PK_28183ac4fb53b95f073997aeb9f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variant_attribute_value" ("id" SERIAL NOT NULL, "rawValue" character varying, "variant_id" integer, "attribute_id" integer, "option_id" integer, CONSTRAINT "UQ_e7d98841f4f4b9e9c77f5079582" UNIQUE ("variant_id", "attribute_id"), CONSTRAINT "PK_3b1654674ab84693c2f47f64fd2" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "product_attribute_option" ADD CONSTRAINT "FK_d7566e0bc8f93a984f5f68a11f3" FOREIGN KEY ("attribute_id") REFERENCES "product_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_product_attribute" ADD CONSTRAINT "FK_fcc40ed8ded3bb49f1bb15be635" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_product_attribute" ADD CONSTRAINT "FK_2d4d992d34d28037fef5e46d295" FOREIGN KEY ("attribute_id") REFERENCES "product_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_2f3b4703f15161f9117f3f56cbe" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_attribute_value" ADD CONSTRAINT "FK_62892eef56f4a13c43634bd1aa2" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_attribute_value" ADD CONSTRAINT "FK_32ecf8f744f84d3886fcf18a9f9" FOREIGN KEY ("attribute_id") REFERENCES "product_attribute"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_attribute_value" ADD CONSTRAINT "FK_5968c3c7fce4ba6fe6db1713893" FOREIGN KEY ("option_id") REFERENCES "product_attribute_option"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variant_attribute_value" DROP CONSTRAINT "FK_5968c3c7fce4ba6fe6db1713893"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_attribute_value" DROP CONSTRAINT "FK_32ecf8f744f84d3886fcf18a9f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_attribute_value" DROP CONSTRAINT "FK_62892eef56f4a13c43634bd1aa2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "FK_2f3b4703f15161f9117f3f56cbe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_product_attribute" DROP CONSTRAINT "FK_2d4d992d34d28037fef5e46d295"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_product_attribute" DROP CONSTRAINT "FK_fcc40ed8ded3bb49f1bb15be635"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_attribute_option" DROP CONSTRAINT "FK_d7566e0bc8f93a984f5f68a11f3"`,
    );

    await queryRunner.query(`DROP TABLE "product_variant_attribute_value"`);
    await queryRunner.query(`DROP TABLE "product_variant"`);
    await queryRunner.query(`DROP TABLE "category_product_attribute"`);
    await queryRunner.query(`DROP TABLE "product_attribute_option"`);
    await queryRunner.query(`DROP TABLE "product_attribute"`);
  }
}
