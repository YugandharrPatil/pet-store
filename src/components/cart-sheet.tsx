"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/store/use-cart";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartSheet() {
	const [mounted, setMounted] = useState(false);
	const cart = useCart();

	useEffect(() => {
		const timer = setTimeout(() => setMounted(true), 0);
		return () => clearTimeout(timer);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" className="relative">
				<ShoppingCart className="h-5 w-5" />
			</Button>
		);
	}

	const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

	return (
		<Sheet>
			<SheetTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
				<ShoppingCart className="h-5 w-5" />
				{itemCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground font-bold flex items-center justify-center">{itemCount}</span>}
				<span className="sr-only">Cart</span>
			</SheetTrigger>

			<SheetContent className="flex flex-col w-full sm:max-w-lg">
				<SheetHeader>
					<SheetTitle>Your Shopping Cart</SheetTitle>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto mt-6">
					{cart.items.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
							<ShoppingCart className="h-12 w-12 opacity-50" />
							<p>Your cart is empty</p>
						</div>
					) : (
						<ul className="space-y-4">
							{cart.items.map((item) => (
								<li key={item.id} className="flex gap-4 border-b pb-4">
									<div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
										{item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <span className="text-xs">No img</span>}
									</div>

									<div className="flex flex-1 flex-col">
										<div>
											<div className="flex justify-between text-base font-medium">
												<h3 className="line-clamp-1">{item.name}</h3>
												<p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
											</div>
											<p className="mt-1 text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
										</div>

										<div className="flex flex-1 items-end justify-between text-sm">
											<div className="flex items-center border rounded-md">
												<Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}>
													<Minus className="h-3 w-3" />
												</Button>
												<div className="w-8 text-center text-xs">{item.quantity}</div>
												<Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}>
													<Plus className="h-3 w-3" />
												</Button>
											</div>

											<div className="flex">
												<Button variant="ghost" size="sm" className="text-destructive font-medium h-auto p-0" onClick={() => cart.removeItem(item.id)}>
													<Trash2 className="h-4 w-4 mr-1" /> Remove
												</Button>
											</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				{cart.items.length > 0 && (
					<div className="border-t pt-6 space-y-4">
						<div className="flex justify-between text-base font-medium">
							<p>Subtotal</p>
							<p>${cart.subtotal.toFixed(2)}</p>
						</div>
						<p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout.</p>
						<Link href="/cart" className="block w-full">
							<Button className="w-full" size="lg">
								Go to Cart Page
							</Button>
						</Link>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
