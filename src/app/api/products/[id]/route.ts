import { TABLES } from "@/lib/constants/db-tables";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const user = await currentUser();
		if (!user || user.publicMetadata?.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const body = await request.json();
		const { name, description, price, stock, pet_type, age_group, ingredients, feeding_guide, image_urls } = body;



		const { data, error } = await supabase.from(TABLES.PRODUCTS).update({ name, description, price, stock, pet_type, age_group, ingredients, feeding_guide, image_urls }).eq("id", id).select().single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ data });
	} catch (error: unknown) {
		const err = error as Error;
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
