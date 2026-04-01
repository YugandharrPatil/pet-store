CREATE TABLE "pet_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"line_1" text NOT NULL,
	"line_2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"items" jsonb DEFAULT '[]' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price_at_purchase" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_amount" numeric NOT NULL,
	"shipping_cost" numeric DEFAULT '0' NOT NULL,
	"status" text NOT NULL,
	"shipping_address" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"pet_type" text NOT NULL,
	"age_group" text NOT NULL,
	"ingredients" text,
	"feeding_guide" text,
	"image_urls" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pet_addresses" ADD CONSTRAINT "pet_addresses_user_id_pet_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pet_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_carts" ADD CONSTRAINT "pet_carts_user_id_pet_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pet_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_order_items" ADD CONSTRAINT "pet_order_items_order_id_pet_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pet_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_order_items" ADD CONSTRAINT "pet_order_items_product_id_pet_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."pet_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_orders" ADD CONSTRAINT "pet_orders_user_id_pet_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pet_users"("id") ON DELETE no action ON UPDATE no action;