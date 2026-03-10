"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";
import { Minus, Plus, ShoppingCart } from "lucide-react";

interface AddToCartProps {
	product: {
		id: string;
		name: string;
		price: number;
		image_urls: string[];
		stock: number;
	};
}

export function AddToCartButton({ product }: AddToCartProps) {
	const items = useCart((state) => state.items);
	const addItem = useCart((state) => state.addItem);
	const removeItem = useCart((state) => state.removeItem);
	const updateQuantity = useCart((state) => state.updateQuantity);

	const cartItem = items.find((item) => item.id === product.id);
	const quantityInCart = cartItem?.quantity || 0;

	const handleIncrement = () => {
		if (quantityInCart === 0) {
			addItem(
				{
					id: product.id,
					name: product.name,
					price: product.price,
					image: product.image_urls?.[0] || "",
				},
				1,
			);
		} else {
			updateQuantity(product.id, Math.min(product.stock, quantityInCart + 1));
		}
	};

	const handleDecrement = () => {
		if (quantityInCart > 1) {
			updateQuantity(product.id, quantityInCart - 1);
		} else if (quantityInCart === 1) {
			removeItem(product.id);
		}
	};

	if (product.stock === 0) {
		return (
			<Button size="lg" className="flex-1 w-full" disabled>
				Out of Stock
			</Button>
		);
	}

	return (
		<div className="w-full space-y-4 pt-2">
			{quantityInCart === 0 ? (
				<div className="flex gap-4 pt-4">
					<Button size="lg" className="flex-1" onClick={handleIncrement}>
						<ShoppingCart className="mr-2 h-5 w-5" />
						Add to Cart
					</Button>
				</div>
			) : (
				<div className="flex items-center gap-4">
					<span className="font-medium min-w-[100px]">
						{quantityInCart} item{quantityInCart > 1 ? "s" : ""} in cart
					</span>
					<div className="flex items-center border rounded-md">
						<Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={handleDecrement}>
							<Minus className="h-4 w-4" />
						</Button>
						<div className="w-12 text-center text-sm">{quantityInCart}</div>
						<Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={handleIncrement} disabled={quantityInCart >= product.stock}>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
