import { TABLES } from "@/lib/constants/db-tables";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const { userId } = await auth();
		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!);
		let { data: user } = await supabase.from(TABLES.USERS).select("id").eq("clerk_user_id", userId).maybeSingle();

		// If user doesn't exist yet (Clerk webhook race condition), create a ghost user
		if (!user) {
			const { data: newUser, error } = await supabase
				.from(TABLES.USERS)
				.insert({ clerk_user_id: userId, email: `${userId}@placeholder.com` }) // Placeholder email that will be overwritten by webhook later
				.select("id")
				.single();

			if (error || !newUser) {
				return NextResponse.json({ items: [] });
			}
			user = newUser;
		}

		const { data: cart } = await supabase.from(TABLES.CARTS).select("items").eq("user_id", user.id).maybeSingle();

		return NextResponse.json({ items: cart?.items || [] });
	} catch (error) {
		console.error("GET /api/cart error", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {
		const { userId } = await auth();
		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const body = await req.json();
		const items = body.items || [];

		const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!);
		let { data: user } = await supabase.from(TABLES.USERS).select("id").eq("clerk_user_id", userId).maybeSingle();

		// If user doesn't exist yet, create a ghost user
		if (!user) {
			const { data: newUser, error } = await supabase
				.from(TABLES.USERS)
				.insert({ clerk_user_id: userId, email: `${userId}@placeholder.com` })
				.select("id")
				.single();

			if (error || !newUser) {
				return NextResponse.json({ error: "Could not create user" }, { status: 500 });
			}
			user = newUser;
		}

		const { error } = await supabase.from(TABLES.CARTS).upsert(
			{
				user_id: user.id,
				items,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "user_id" },
		);

		if (error) throw error;

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("PUT /api/cart error", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
