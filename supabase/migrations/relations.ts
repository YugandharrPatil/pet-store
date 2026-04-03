import { relations } from "drizzle-orm/relations";
import { petUsers, petAddresses, petCarts, petOrders, petOrderItems, petProducts } from "./schema";

export const petAddressesRelations = relations(petAddresses, ({one}) => ({
	petUser: one(petUsers, {
		fields: [petAddresses.userId],
		references: [petUsers.id]
	}),
}));

export const petUsersRelations = relations(petUsers, ({many}) => ({
	petAddresses: many(petAddresses),
	petCarts: many(petCarts),
	petOrders: many(petOrders),
}));

export const petCartsRelations = relations(petCarts, ({one}) => ({
	petUser: one(petUsers, {
		fields: [petCarts.userId],
		references: [petUsers.id]
	}),
}));

export const petOrdersRelations = relations(petOrders, ({one, many}) => ({
	petUser: one(petUsers, {
		fields: [petOrders.userId],
		references: [petUsers.id]
	}),
	petOrderItems: many(petOrderItems),
}));

export const petOrderItemsRelations = relations(petOrderItems, ({one}) => ({
	petOrder: one(petOrders, {
		fields: [petOrderItems.orderId],
		references: [petOrders.id]
	}),
	petProduct: one(petProducts, {
		fields: [petOrderItems.productId],
		references: [petProducts.id]
	}),
}));

export const petProductsRelations = relations(petProducts, ({many}) => ({
	petOrderItems: many(petOrderItems),
}));