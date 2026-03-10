import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TABLES } from "@/lib/constants/db-tables";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { CalendarDays, CheckCircle2, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
	const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";
	const supabase = createClient(supabaseUrl, supabaseServiceKey);

	// Fetch order details
	const { data: order, error } = await supabase
		.from(TABLES.ORDERS)
		.select(
			`
      *,
      pet_users!inner(clerk_user_id),
      pet_order_items(*, pet_products(*))
    `,
		)
		.eq("id", id)
		.single();

	if (error || !order || order.pet_users.clerk_user_id !== userId) {
		notFound();
	}

	const deliveryDate = new Date(order.created_at);
	deliveryDate.setDate(deliveryDate.getDate() + 3); // Mock 3 day delivery

	return (
		<div className="container mx-auto px-4 py-12 max-w-4xl">
			<div className="flex flex-col items-center text-center space-y-4 mb-12">
				<CheckCircle2 className="h-16 w-16 text-green-600" />
				<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Order Confirmed!</h1>
				<p className="text-muted-foreground text-lg max-w-xl"> Thank you for your purchase. We&apos;ve received your order and will begin processing it shortly.</p>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				<div className="space-y-8">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Package className="mr-2 h-5 w-5" />
								Order Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Order Number</p>
								<p className="font-mono">{order.id}</p>
							</div>

							<div className="space-y-2 border-t pt-4">
								{order.pet_order_items.map((item: { id: string; quantity: number; price_at_purchase: number; pet_products: { name: string } }) => (
									<div key={item.id} className="flex justify-between items-center text-sm">
										<div className="flex items-center space-x-2">
											<span className="font-medium">{item.quantity}x</span>
											<span className="truncate max-w-[200px]">{item.pet_products?.name || "Unknown Product"}</span>
										</div>
										<span className="font-medium">${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
									</div>
								))}
							</div>

							<div className="space-y-2 border-t pt-4 text-sm">
								<div className="flex justify-between text-muted-foreground">
									<span>Subtotal</span>
									<span>${(order.total_amount - order.shipping_cost).toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-muted-foreground">
									<span>Shipping</span>
									<span>{order.shipping_cost === 0 ? "Free" : `$${order.shipping_cost.toFixed(2)}`}</span>
								</div>
								<div className="flex justify-between font-bold text-base pt-2">
									<span>Total</span>
									<span>${order.total_amount.toFixed(2)}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-8">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<MapPin className="mr-2 h-5 w-5" />
								Delivery Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<address className="not-italic text-sm space-y-1 text-muted-foreground">
								<p className="font-medium text-foreground">{order.shipping_address.name}</p>
								<p>{order.shipping_address.line_1}</p>
								{order.shipping_address.line_2 && <p>{order.shipping_address.line_2}</p>}
								<p>
									{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
								</p>
								<p>{order.shipping_address.country}</p>
							</address>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<CalendarDays className="mr-2 h-5 w-5" />
								Estimated Delivery
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="font-medium text-lg text-primary">
								{deliveryDate.toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})}
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className="mt-12 text-center">
				<Link href="/products">
					<Button size="lg" variant="outline">
						Continue Shopping
					</Button>
				</Link>
			</div>
		</div>
	);
}
