"use client";

import { useCart } from "@/store/use-cart";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef } from "react";

export function CartSync() {
	const { isSignedIn, isLoaded } = useAuth();
	const items = useCart((state) => state.items);
	const setItems = useCart((state) => state.setItems);

	const initialized = useRef(false);
	const previousItems = useRef(items);

	// Sync local cart and server cart
	useEffect(() => {
		if (!isLoaded) return;

		// Pull cart from server upon login
		if (isSignedIn && !initialized.current) {
			axios
				.get("/api/cart")
				.then((res) => {
					const dbItems = res.data?.items || [];

					// Merge criteria: local wins if items > 0 (e.g. they added items as guest)
					// (user can add items to cart before logging in as well. if he does, that cart is used in the server and the previous cart is discarded)
					if (items.length > 0) {
						axios.put("/api/cart", { items }).catch(console.error);
					} else if (dbItems.length > 0) {
						setItems(dbItems);
					}

					initialized.current = true;
					previousItems.current = items.length > 0 ? items : dbItems;
				})
				.catch((err) => {
					console.error("Error fetching remote cart:", err);
					initialized.current = true;
				});
		}
		// sync cart updates with db after logged in and cart altered. debounce the sync by 1s for each change
		else if (isSignedIn && initialized.current) {
			const changed = JSON.stringify(items) !== JSON.stringify(previousItems.current);
			if (changed) {
				previousItems.current = items;
				const timeoutId = setTimeout(() => {
					axios.put("/api/cart", { items }).catch(console.error);
				}, 1000); // 1 second debounce
				return () => clearTimeout(timeoutId);
			}
		}
	}, [isLoaded, isSignedIn, items, setItems]);

	// Automatically empty the local cart state when they sign out
	useEffect(() => {
		if (isLoaded && !isSignedIn && initialized.current) {
			useCart.getState().clearCart();
			initialized.current = false;
		}
	}, [isLoaded, isSignedIn]);

	return null;
}
