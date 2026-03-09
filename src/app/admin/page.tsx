import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TABLES } from "@/lib/constants/db-tables";
import { createClient } from "@supabase/supabase-js";
import { DollarSign, Package, ShoppingBag } from "lucide-react";

export default async function AdminDashboardPage() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
	const supabase = createClient(supabaseUrl, supabaseServiceKey);

	// Fetch basic stats
	const { count: productsCount } = await supabase.from(TABLES.PRODUCTS).select("*", { count: "exact", head: true });
	const { data: orders } = await supabase.from(TABLES.ORDERS).select("total_amount");

	const ordersCount = orders?.length || 0;
	const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
				<p className="text-muted-foreground mt-2">Welcome to the PawfectPets admin panel.</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
						<p className="text-xs text-muted-foreground">Lifetime earnings</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<ShoppingBag className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{ordersCount}</div>
						<p className="text-xs text-muted-foreground">Placed by customers</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Products in Catalog</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{productsCount || 0}</div>
						<p className="text-xs text-muted-foreground">Active products</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
