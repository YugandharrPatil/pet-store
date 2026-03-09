import { TABLES } from "@/lib/constants/db-tables";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { items, shippingAddress, totalAmount, shippingCost } = body;

		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
		const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""; // bypassing RLS for safe server creation
		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// Get the internal Supabase user ID from Clerk ID
		const { data: user, error: userError } = await supabase.from(TABLES.USERS).select("id").eq("clerk_user_id", userId).single();

		if (userError || !user) {
			throw new Error("User not found in Supabase");
		}

		// 1. Create the order
		const { data: order, error: orderError } = await supabase
			.from(TABLES.ORDERS)
			.insert({
				user_id: user.id,
				total_amount: totalAmount,
				shipping_cost: shippingCost,
				status: "pending",
				shipping_address: shippingAddress,
			})
			.select("id")
			.single();

		if (orderError) throw orderError;

		// 2. Create the order items
		const orderItemsRecord = items.map((item: { id: string; quantity: number; price: number }) => ({
			order_id: order.id,
			product_id: item.id,
			quantity: item.quantity,
			price_at_purchase: item.price,
		}));

		const { error: itemsError } = await supabase.from(TABLES.ORDER_ITEMS).insert(orderItemsRecord);

		if (itemsError) throw itemsError;

		// 3. Update stock for products (Simple decrement, doesn't handle concurrency perfectly but good enough for mock)
		for (const item of items) {
			// Get current stock
			const { data: product } = await supabase.from(TABLES.PRODUCTS).select("stock").eq("id", item.id).single();

			if (product) {
				await supabase
					.from(TABLES.PRODUCTS)
					.update({ stock: Math.max(0, product.stock - item.quantity) })
					.eq("id", item.id);
			}
		}

		return NextResponse.json({ success: true, orderId: order.id });
	} catch (error: unknown) {
		console.error("Order creation error:", error);
		const err = error as Error;
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
