import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
	id: string; // product id
	name: string;
	price: number;
	image: string;
	quantity: number;
}

interface CartStore {
	items: CartItem[];
	setItems: (items: CartItem[]) => void;
	addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
}

export const useCart = create<CartStore>()(
	persist(
		(set) => ({
			items: [],
			setItems: (items) => set({ items }),
			// used when there is none of this item in the cart
			addItem: (item, quantity = 1) => {
				set((state) => {
					const existing = state.items.find((i) => i.id === item.id);
					if (existing) {
						return {
							// update quantity field of the existing item
							items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i)),
						};
					}
					// create new item and then set it's quantity field
					return { items: [...state.items, { ...item, quantity }] };
				});
			},
			// used when there is only one item in the cart
			removeItem: (id) => {
				set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
			},
			// used to add and remove 1 item when there already is an instance of this item in the cart
			updateQuantity: (id, quantity) => {
				set((state) => ({
					items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)),
				}));
			},
			clearCart: () => set({ items: [] }),
		}),
		{
			name: "pawfect-pets-cart",
		},
	),
);
