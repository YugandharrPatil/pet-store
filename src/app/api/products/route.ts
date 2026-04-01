import { TABLES } from "@/lib/constants/db-tables";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const type = searchParams.get("type");
	const age = searchParams.get("age");
	const search = searchParams.get("search");
	const sort = searchParams.get("sort") || "newest";
	const page = parseInt(searchParams.get("page") || "1");
	const limit = parseInt(searchParams.get("limit") || "10");



	let query = supabase.from(TABLES.PRODUCTS).select("*", { count: "exact" });

	if (type) query = query.eq("pet_type", type);
	if (age) query = query.eq("age_group", age);
	if (search) query = query.ilike("name", `%${search}%`);

	if (sort === "price_asc") {
		query = query.order("price", { ascending: true });
	} else if (sort === "price_desc") {
		query = query.order("price", { ascending: false });
	} else {
		query = query.order("created_at", { ascending: false });
	}

	const from = (page - 1) * limit;
	const to = from + limit - 1;
	query = query.range(from, to);

	const { data, count, error } = await query;

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		data,
		meta: {
			total: count,
			page,
			limit,
			totalPages: count ? Math.ceil(count / limit) : 0,
		},
	});
}

export async function POST(request: Request) {
	try {
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { name, description, price, stock, pet_type, age_group, ingredients, feeding_guide, image_urls } = body;



		const { data, error } = await supabase.from(TABLES.PRODUCTS).insert({ name, description, price, stock, pet_type, age_group, ingredients, feeding_guide, image_urls }).select().single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ data });
	} catch (error: unknown) {
		const err = error as Error;
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
