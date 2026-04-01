import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TABLES } from "@/lib/constants/db-tables";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}



	// Fetch all orders with details for this specific securely scoped user id
	const { data: orders, error } = await supabase
		.from(TABLES.ORDERS)
		.select(
			`
      *,
      pet_users!inner(clerk_user_id),
      pet_order_items(*, pet_products(*))
    `,
		)
		.eq("pet_users.clerk_user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching orders:", error);
	}

	return (
		<div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center space-x-3">
					<Package className="h-8 w-8 text-primary" />
					<h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
				</div>
				<Link href="/products">
					<Button variant="outline">Continue Shopping</Button>
				</Link>
			</div>

			{!orders || orders.length === 0 ? (
				<div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
					<Package className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
					<h2 className="text-xl font-semibold mb-2">No orders found</h2>
					<p className="text-muted-foreground mb-8">You haven&apos;t placed any orders yet.</p>
					<Link href="/products">
						<Button size="lg">Start Shopping</Button>
					</Link>
				</div>
			) : (
				<div className="space-y-6">
					{orders.map((order) => {
						return (
							<Card key={order.id} className="overflow-hidden">
								<CardHeader className="bg-muted/30 border-b pb-4">
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
										<div>
											<p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Order Placed</p>
											<p className="font-medium text-sm">
												{new Date(order.created_at).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</p>
										</div>
										<div>
											<p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Total</p>
											<p className="font-medium text-sm">${order.total_amount.toFixed(2)}</p>
										</div>
										<div className="col-span-2 md:col-span-1 md:text-right">
											<p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Order #</p>
											<p className="font-mono text-sm">{order.id.slice(0, 10).toUpperCase()}</p>
										</div>
										<div className="col-span-2 md:col-span-1 flex items-center justify-end gap-3 text-right">
											<Badge variant={order.status === "delivered" ? "default" : order.status === "shipped" ? "secondary" : "outline"} className="capitalize">
												{order.status}
											</Badge>
											<Link href={`/order-confirmation/${order.id}`}>
												<Button variant="outline" size="sm">
													View Details
												</Button>
											</Link>
										</div>
									</div>
								</CardHeader>
								<CardContent className="pt-6">
									<div className="space-y-6">
										{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
										{order.pet_order_items.map((item: any) => (
											<div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
												<div className="w-20 h-20 bg-muted rounded-xl overflow-hidden shrink-0 border flex items-center justify-center p-2">
													{item.pet_products?.image_urls?.[0] ? (
														// eslint-disable-next-line @next/next/no-img-element
														<img src={item.pet_products.image_urls[0]} alt={item.pet_products.name} className="w-full h-full object-cover rounded-md" />
													) : (
														<span className="text-xs text-muted-foreground">No img</span>
													)}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
														<div>
															<Link href={`/products/${item.product_id}`} className="font-semibold text-base hover:underline line-clamp-1">
																{item.pet_products?.name || "Unknown Product"}
															</Link>
															<p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
														</div>
														<div className="font-medium text-lg shrink-0">${(item.price_at_purchase * item.quantity).toFixed(2)}</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
