import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TABLES } from "@/lib/constants/db-tables";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AccountPage() {
	const { userId } = await auth();
	const user = await currentUser();

	if (!userId || !user) {
		redirect("/sign-in");
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""; // read-only context bypass RLS
	const supabase = createClient(supabaseUrl, supabaseServiceKey);

	// Get Supabase User ID
	const { data: dbUser } = await supabase.from(TABLES.USERS).select("id").eq("clerk_user_id", userId).single();

	let orders = [];
	if (dbUser) {
		const { data } = await supabase
			.from(TABLES.ORDERS)
			.select(
				`
        *,
        order_items(*, pet_products(name))
      `,
			)
			.eq("user_id", dbUser.id)
			.order("created_at", { ascending: false });
		orders = data || [];
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-5xl">
			<h1 className="text-3xl font-bold tracking-tight mb-8">My Account</h1>

			<div className="grid md:grid-cols-3 gap-8">
				<div className="space-y-6 md:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle>Profile</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Name</p>
								<p>
									{user.firstName} {user.lastName}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">Email</p>
								<p>{user.emailAddresses[0]?.emailAddress}</p>
							</div>

							<div className="pt-4 border-t">
								{/* Re-using Clerk User Profile mode if needed */}
								<p className="text-sm text-muted-foreground mb-4">Manage your profile details securely via Clerk.</p>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="md:col-span-2 space-y-6">
					<h2 className="text-2xl font-semibold">Order History</h2>

					{orders.length === 0 ? (
						<Card>
							<CardContent className="p-12 text-center text-muted-foreground">
								<p className="mb-4">You haven&apos;t placed any orders yet.</p>
								<Link href="/products">
									<Button>Start Shopping</Button>
								</Link>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{orders.map((order: { id: string; created_at: string; status: string; total_amount: number; order_items: { pet_products: { name: string } }[] }) => (
								<Card key={order.id}>
									<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
										<div>
											<CardTitle className="text-base">Order #{order.id.split("-")[0]}</CardTitle>
											<p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
										</div>
										<Badge variant={order.status === "delivered" ? "default" : "secondary"} className="capitalize">
											{order.status}
										</Badge>
									</CardHeader>
									<CardContent>
										<div className="flex justify-between items-center mb-4">
											<p className="font-semibold">${order.total_amount.toFixed(2)}</p>
											<p className="text-sm text-muted-foreground">{order.order_items.length} items</p>
										</div>
										<div className="text-sm text-muted-foreground mb-4">{order.order_items.map((item: { pet_products: { name: string } }) => item.pet_products?.name || "Unknown").join(", ")}</div>
										<Link href={`/order-confirmation/${order.id}`}>
											<Button variant="outline" size="sm">
												View Details
											</Button>
										</Link>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
