"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

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
	const [quantity, setQuantity] = useState(1);
	const addItem = useCart((state) => state.addItem);

	const handleAddToCart = () => {
		addItem(
			{
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.image_urls?.[0] || "",
			},
			quantity,
		);
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
			<div className="flex items-center gap-4">
				<span className="font-medium min-w-[100px]">Quantity:</span>
				<div className="flex items-center border rounded-md">
					<Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
						<Minus className="h-4 w-4" />
					</Button>
					<div className="w-12 text-center text-sm">{quantity}</div>
					<Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="flex gap-4 pt-4">
				<Button size="lg" className="flex-1" onClick={handleAddToCart}>
					<ShoppingCart className="mr-2 h-5 w-5" />
					Add to Cart
				</Button>
			</div>
		</div>
	);
}
