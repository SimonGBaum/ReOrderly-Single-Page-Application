CREATE TABLE "users"(
    "id" UUID NOT NULL DEFAULT 'Default: gen_random_uuid()',
    "user_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "mailing_address" TEXT NOT NULL,
    "billing_address" TEXT NOT NULL,
    "role" VARCHAR(255) NOT NULL DEFAULT 'Default: ''member''. Can be set to ''admin''',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'Default: NOW()'
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
COMMENT
ON COLUMN
    "users"."user_name" IS 'Unique identifier for mentions/login';
COMMENT
ON COLUMN
    "users"."email" IS 'Crucial for auth, must be lowercase/unique';
COMMENT
ON COLUMN
    "users"."password" IS 'Never store plain text passwords!';
COMMENT
ON COLUMN
    "users"."mailing_address" IS 'Better than VARCHAR for multi-line addresses';
CREATE TABLE "orders"(
    "id" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "order_type" VARCHAR(255) NOT NULL,
    "order_name" VARCHAR(255) NOT NULL,
    "store_name" VARCHAR(255) NOT NULL,
    "store_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'Default: NOW()',
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'Default: NOW()'
);
ALTER TABLE
    "orders" ADD PRIMARY KEY("id");
CREATE INDEX "orders_user_id_index" ON
    "orders"("user_id");
COMMENT
ON COLUMN
    "orders"."id" IS 'The "Order Number" shown to users';
COMMENT
ON COLUMN
    "orders"."user_id" IS 'References users(id) ON DELETE CASCADE';
COMMENT
ON COLUMN
    "orders"."status" IS 'Enforces: ''draft'', ''active'', or ''cancelled''';
COMMENT
ON COLUMN
    "orders"."order_type" IS 'e.g., ''Subscription'', ''One-time''';
CREATE TABLE "order_items"(
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_type" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 'Default: 1',
    "description" TEXT NOT NULL
);
ALTER TABLE
    "order_items" ADD PRIMARY KEY("id");
CREATE INDEX "order_items_order_id_index" ON
    "order_items"("order_id");
COMMENT
ON COLUMN
    "order_items"."id" IS 'Unique item identifier';
COMMENT
ON COLUMN
    "order_items"."order_id" IS 'References orders(id) ON DELETE CASCADE';
COMMENT
ON COLUMN
    "order_items"."product_type" IS 'e.g., ''Medication'', ''Food'', ''Hygiene''';
COMMENT
ON COLUMN
    "order_items"."description" IS 'Optional detailed notes for the user';
CREATE TABLE "delivery_schedules"(
    "id" UUID NOT NULL DEFAULT 'Unique schedule ID',
    "order_id" UUID NOT NULL,
    "frequency" VARCHAR(255) NOT NULL,
    "max_deliveries" INTEGER NOT NULL,
    "delivery_count" INTEGER NOT NULL,
    "last_delivery_date" DATE NOT NULL,
    "expected_delivery_date" DATE NOT NULL
);
ALTER TABLE
    "delivery_schedules" ADD PRIMARY KEY("id");
CREATE INDEX "delivery_schedules_order_id_index" ON
    "delivery_schedules"("order_id");
COMMENT
ON COLUMN
    "delivery_schedules"."order_id" IS 'References orders(id) ON DELETE CASCADE';
COMMENT
ON COLUMN
    "delivery_schedules"."frequency" IS 'e.g., ''Weekly'', ''Monthly'', ''Every 3 Months''';
COMMENT
ON COLUMN
    "delivery_schedules"."max_deliveries" IS 'Total planned iterations (Number of deliveries)';
COMMENT
ON COLUMN
    "delivery_schedules"."delivery_count" IS 'Counter for "Lifetime number of deliveries"';
COMMENT
ON COLUMN
    "delivery_schedules"."last_delivery_date" IS 'Nullable until the first delivery happens';
COMMENT
ON COLUMN
    "delivery_schedules"."expected_delivery_date" IS 'The calculated next drop date';
ALTER TABLE
    "order_items" ADD CONSTRAINT "order_items_order_id_foreign" FOREIGN KEY("order_id") REFERENCES "orders"("id");
ALTER TABLE
    "orders" ADD CONSTRAINT "orders_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "delivery_schedules" ADD CONSTRAINT "delivery_schedules_order_id_foreign" FOREIGN KEY("order_id") REFERENCES "orders"("id");