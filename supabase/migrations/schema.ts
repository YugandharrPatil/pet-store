import { pgTable, serial, text, timestamp, uuid, foreignKey, boolean, jsonb, numeric, integer, pgSequence, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const propertyStatus = pgEnum("property_status", ['available', 'sold', 'pending'])
export const propertyType = pgEnum("property_type", ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial'])
export const senderRole = pgEnum("sender_role", ['user', 'admin'])
export const visitStatus = pgEnum("visit_status", ['pending', 'confirmed', 'cancelled'])

export const agencyProjectsIdSeq = pgSequence("agency_projects_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const agencyMessagesIdSeq = pgSequence("agency_messages_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })

export const petMessages = pgTable("pet_messages", {
	id: serial().primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	subject: text().notNull(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const petUsers = pgTable("pet_users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clerkUserId: text("clerk_user_id").notNull(),
	email: text().notNull(),
	name: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const petAddresses = pgTable("pet_addresses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	line1: text("line_1").notNull(),
	line2: text("line_2"),
	city: text().notNull(),
	state: text().notNull(),
	postalCode: text("postal_code").notNull(),
	country: text().notNull(),
	isDefault: boolean("is_default").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [petUsers.id],
			name: "pet_addresses_user_id_pet_users_id_fk"
		}),
]);

export const petCarts = pgTable("pet_carts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	items: jsonb().default([]).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [petUsers.id],
			name: "pet_carts_user_id_pet_users_id_fk"
		}),
]);

export const petOrders = pgTable("pet_orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	totalAmount: numeric("total_amount").notNull(),
	shippingCost: numeric("shipping_cost").default('0').notNull(),
	status: text().notNull(),
	shippingAddress: jsonb("shipping_address").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [petUsers.id],
			name: "pet_orders_user_id_pet_users_id_fk"
		}),
]);

export const petOrderItems = pgTable("pet_order_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	productId: uuid("product_id").notNull(),
	quantity: integer().notNull(),
	priceAtPurchase: numeric("price_at_purchase").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [petOrders.id],
			name: "pet_order_items_order_id_pet_orders_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [petProducts.id],
			name: "pet_order_items_product_id_pet_products_id_fk"
		}),
]);

export const petProducts = pgTable("pet_products", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	price: numeric().notNull(),
	stock: integer().default(0).notNull(),
	petType: text("pet_type").notNull(),
	ageGroup: text("age_group").notNull(),
	ingredients: text(),
	feedingGuide: text("feeding_guide"),
	imageUrls: text("image_urls").array(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});
