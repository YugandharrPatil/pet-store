import { pgTable, text, timestamp, boolean, jsonb, numeric, integer, uuid, serial } from "drizzle-orm/pg-core";

export const petMessages = pgTable("pet_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const petUsers = pgTable("pet_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  email: text("email").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const petAddresses = pgTable("pet_addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => petUsers.id).notNull(),
  line1: text("line_1").notNull(),
  line2: text("line_2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const petCarts = pgTable("pet_carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => petUsers.id).notNull(),
  items: jsonb("items").default('[]').notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const petProducts = pgTable("pet_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  stock: integer("stock").notNull().default(0),
  petType: text("pet_type").notNull(),
  ageGroup: text("age_group").notNull(),
  ingredients: text("ingredients"),
  feedingGuide: text("feeding_guide"),
  imageUrls: text("image_urls").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const petOrders = pgTable("pet_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => petUsers.id).notNull(),
  totalAmount: numeric("total_amount").notNull(),
  shippingCost: numeric("shipping_cost").notNull().default('0'),
  status: text("status").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const petOrderItems = pgTable("pet_order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => petOrders.id).notNull(),
  productId: uuid("product_id").references(() => petProducts.id).notNull(),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: numeric("price_at_purchase").notNull(),
});
