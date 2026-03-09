import { TABLES } from "@/lib/constants/db-tables";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const type = searchParams.get("type");
	const age = searchParams.get("age");
	const search = searchParams.get("search");
	const sort = searchParams.get("sort") || "newest";
	const page = parseInt(searchParams.get("page") || "1");
	const limit = parseInt(searchParams.get("limit") || "10");

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
