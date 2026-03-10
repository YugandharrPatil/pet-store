"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/store/use-cart";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
	const [mounted, setMounted] = useState(false);
	const cart = useCart();
	const router = useRouter();
	const { isLoaded, userId } = useAuth();

	const [isSuccess, setIsSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [address, setAddress] = useState({
		line_1: "",
		line_2: "",
		city: "",
		state: "",
		postal_code: "",
		country: "USA",
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (mounted && isLoaded && !isSuccess) {
			if (cart.items.length === 0) {
				router.push("/cart");
			} else if (!userId) {
				router.push("/sign-in?redirect_url=/checkout");
			}
		}
	}, [mounted, isLoaded, cart.items.length, userId, router, isSuccess]);

	if (!mounted || !isLoaded) {
		return <div className="p-8 text-center">Loading...</div>;
	}

	// Wait for redirect if conditions aren't met
	if ((cart.items.length === 0 && !isSuccess) || !userId) {
		return null;
	}

	const subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
	const shippingCost = subtotal > 50 ? 0 : 5.99;
	const totalAmount = subtotal + shippingCost;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await axios.post("/api/orders", {
				items: cart.items,
				shippingAddress: address,
				totalAmount,
				shippingCost,
			});

			const orderId = response.data.orderId;
			setIsSuccess(true);
			cart.clearCart();
			router.push(`/order-confirmation/${orderId}`);
			return;
		} catch (error) {
			console.error(error);
			alert("Failed to place order. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddress({ ...address, [e.target.name]: e.target.value });
	};

	return (
		<div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
			<h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

			<div className="grid md:grid-cols-2 gap-8">
				<div>
					<h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
					<Card>
						<CardContent className="p-6">
							<form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Address Line 1*</label>
									<Input required name="line_1" value={address.line_1} onChange={handleChange} />
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Address Line 2 (Optional)</label>
									<Input name="line_2" value={address.line_2} onChange={handleChange} />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<label className="text-sm font-medium">City*</label>
										<Input required name="city" value={address.city} onChange={handleChange} />
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium">State*</label>
										<Input required name="state" value={address.state} onChange={handleChange} />
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<label className="text-sm font-medium">Postal Code*</label>
										<Input required name="postal_code" value={address.postal_code} onChange={handleChange} />
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium">Country*</label>
										<Input required name="country" value={address.country} onChange={handleChange} />
									</div>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-4">Order Summary</h2>
					<Card>
						<CardContent className="p-6">
							<div className="flow-root mb-6">
								<ul className="-my-4 divide-y">
									{cart.items.map((item) => (
										<li key={item.id} className="flex items-center space-x-4 py-4">
											{item.image ? <img src={item.image} alt="" className="h-16 w-16 rounded object-cover" /> : <div className="h-16 w-16 rounded bg-muted"></div>}
											<div className="flex-1">
												<h3 className="font-medium line-clamp-1">{item.name}</h3>
												<p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
											</div>
											<p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
										</li>
									))}
								</ul>
							</div>

							<div className="space-y-2 pt-4 border-t text-sm">
								<div className="flex justify-between">
									<p>Subtotal</p>
									<p>${subtotal.toFixed(2)}</p>
								</div>
								<div className="flex justify-between">
									<p>Shipping</p>
									<p>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</p>
								</div>
								<div className="flex justify-between font-bold text-lg pt-4 border-t mt-4">
									<p>Total</p>
									<p>${totalAmount.toFixed(2)}</p>
								</div>
							</div>

							<div className="mt-8 pt-6 border-t">
								<p className="text-sm text-muted-foreground mb-4 text-center">Payment is mocked. Clicking below will complete the order without charging.</p>
								<Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={loading}>
									{loading ? "Processing..." : "Complete Mock Order"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
