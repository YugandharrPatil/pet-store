"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/store/use-cart";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
	const [mounted, setMounted] = useState(false);
	const cart = useCart();
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => setMounted(true), 0);
		return () => clearTimeout(timer);
	}, []);

	if (!mounted) {
		return <div className="container mx-auto px-4 py-8">Loading cart...</div>;
	}

	const subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
	const shippingCost = subtotal > 50 ? 0 : 5.99;
	const total = subtotal + shippingCost;

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

			{cart.items.length === 0 ? (
				<div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/50 text-center">
					<h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
					<p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
					<Link href="/products">
						<Button size="lg">Continue Shopping</Button>
					</Link>
				</div>
			) : (
				<div className="grid lg:grid-cols-12 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-8 space-y-4">
						{cart.items.map((item) => (
							<Card key={item.id}>
								<CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
									<div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
										{item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <span className="text-xs">No img</span>}
									</div>

									<div className="flex flex-1 flex-col w-full">
										<div className="flex justify-between w-full">
											<h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
											<p className="font-bold sm:ml-4 whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
										</div>
										<p className="text-sm text-muted-foreground mb-4">${item.price.toFixed(2)} each</p>

										<div className="flex items-center justify-between mt-auto">
											<div className="flex items-center border rounded-md">
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 rounded-none"
													onClick={() => {
														if (item.quantity > 1) {
															cart.updateQuantity(item.id, item.quantity - 1);
														} else {
															cart.removeItem(item.id);
														}
													}}
												>
													<Minus className="h-3 w-3" />
												</Button>
												<div className="w-10 text-center text-sm">{item.quantity}</div>
												<Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}>
													<Plus className="h-3 w-3" />
												</Button>
											</div>

											<Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => cart.removeItem(item.id)}>
												<Trash2 className="h-4 w-4 sm:mr-2" />
												<span className="hidden sm:inline">Remove</span>
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Order Summary */}
					<div className="lg:col-span-4">
						<Card className="sticky top-24">
							<CardContent className="p-6">
								<h2 className="text-xl font-semibold mb-6">Order Summary</h2>

								<div className="space-y-4 mb-6 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Subtotal</span>
										<span className="font-medium">${subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Shipping</span>
										<span className="font-medium">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
									</div>
									{shippingCost > 0 && <p className="text-xs text-muted-foreground">Free shipping on orders over $50! You are ${(50 - subtotal).toFixed(2)} away.</p>}

									<div className="border-t pt-4 mt-4 flex justify-between">
										<span className="font-semibold text-base">Total</span>
										<span className="font-bold text-lg">${total.toFixed(2)}</span>
									</div>
								</div>

								<Button className="w-full" size="lg" onClick={() => router.push("/checkout")}>
									Proceed to Checkout
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>

								<p className="text-xs text-center text-muted-foreground mt-4">Taxes will be calculated at checkout.</p>
							</CardContent>
						</Card>
					</div>
				</div>
			)}
		</div>
	);
}
