import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TABLES } from "@/lib/constants/db-tables";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export default async function AdminOrdersPage() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
	const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";
	const supabase = createClient(supabaseUrl, supabaseServiceKey);

	const { data: orders } = await supabase
		.from(TABLES.ORDERS)
		.select(
			`
      *,
      users!inner(email)
    `,
		)
		.order("created_at", { ascending: false });

	// Server Action for updating status
	async function updateOrderStatus(formData: FormData) {
		"use server";
		const id = formData.get("id") as string;
		const currentStatus = formData.get("status") as string;

		// Cycle status: pending -> shipped -> delivered
		const nextStatus = currentStatus === "pending" ? "shipped" : currentStatus === "shipped" ? "delivered" : "pending";

		const dbAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!);

		await dbAdmin.from(TABLES.ORDERS).update({ status: nextStatus }).eq("id", id);
		revalidatePath("/admin/orders");
		revalidatePath("/account");
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
				<p className="text-muted-foreground mt-2">View and update customer orders.</p>
			</div>

			<div className="rounded-md border bg-background overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Customer Email</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!orders || orders.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
									No orders found.
								</TableCell>
							</TableRow>
						) : (
							orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell className="font-mono text-xs">{order.id.split("-")[0]}</TableCell>
									<TableCell>{order.users.email}</TableCell>
									<TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
									<TableCell className="font-medium">${order.total_amount.toFixed(2)}</TableCell>
									<TableCell>
										<Badge variant={order.status === "delivered" ? "default" : order.status === "shipped" ? "secondary" : "outline"} className="capitalize">
											{order.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<form action={updateOrderStatus}>
											<input type="hidden" name="id" value={order.id} />
											<input type="hidden" name="status" value={order.status} />
											<Button variant="outline" size="sm" type="submit" disabled={order.status === "delivered"}>
												{order.status === "pending" ? "Mark Shipped" : order.status === "shipped" ? "Mark Delivered" : "Done"}
											</Button>
										</form>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
