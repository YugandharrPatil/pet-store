"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	pet_type: string;
	age_group: string;
	ingredients?: string;
	feeding_guide?: string;
	image_urls: string[];
}

interface ProductFormDialogProps {
	product?: Product;
	mode: "create" | "edit";
}

export function ProductFormDialog({ product, mode }: ProductFormDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const [name, setName] = useState(product?.name || "");
	const [description, setDescription] = useState(product?.description || "");
	const [price, setPrice] = useState(product?.price?.toString() || "");
	const [stock, setStock] = useState(product?.stock?.toString() || "");
	const [petType, setPetType] = useState(product?.pet_type || "");
	const [ageGroup, setAgeGroup] = useState(product?.age_group || "");
	const [ingredients, setIngredients] = useState(product?.ingredients || "");
	const [feedingGuide, setFeedingGuide] = useState(product?.feeding_guide || "");
	const [imageUrls, setImageUrls] = useState(product?.image_urls?.join(", ") || "");

	// Reset form when dialog opens (for create mode)
	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen && mode === "create") {
			setName("");
			setDescription("");
			setPrice("");
			setStock("");
			setPetType("");
			setAgeGroup("");
			setIngredients("");
			setFeedingGuide("");
			setImageUrls("");
			setError("");
		}
		if (isOpen && mode === "edit" && product) {
			setName(product.name);
			setDescription(product.description);
			setPrice(product.price.toString());
			setStock(product.stock.toString());
			setPetType(product.pet_type);
			setAgeGroup(product.age_group);
			setIngredients(product.ingredients || "");
			setFeedingGuide(product.feeding_guide || "");
			setImageUrls(product.image_urls?.join(", ") || "");
			setError("");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const parsedImageUrls = imageUrls
			.split(",")
			.map((url) => url.trim())
			.filter(Boolean);

		const payload = {
			name,
			description,
			price: parseFloat(price),
			stock: parseInt(stock),
			pet_type: petType,
			age_group: ageGroup,
			ingredients: ingredients || null,
			feeding_guide: feedingGuide || null,
			image_urls: parsedImageUrls,
		};

		try {
			const url = mode === "edit" ? `/api/products/${product?.id}` : "/api/products";
			const method = mode === "edit" ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to save product");
			}

			setOpen(false);
			router.refresh();
		} catch (err: unknown) {
			const error = err as Error;
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			{mode === "create" ? (
				<DialogTrigger render={<Button />}>
					<Plus className="h-4 w-4 mr-2" />
					Add New Product
				</DialogTrigger>
			) : (
				<DialogTrigger render={<Button variant="ghost" size="icon" />}>
					<Pencil className="h-4 w-4" />
				</DialogTrigger>
			)}
			<DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{mode === "create" ? "Add New Product" : "Edit Product"}</DialogTitle>
					<DialogDescription>{mode === "create" ? "Fill in the details below to add a new product to the catalog." : "Update the product details below."}</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Product Name</Label>
							<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Premium Dog Food" required />
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product..." rows={3} required />
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="price">Price ($)</Label>
								<Input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="29.99" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="stock">Stock</Label>
								<Input id="stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="100" required />
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Pet Type</Label>
								<Select value={petType} onValueChange={(v) => setPetType(v || "")} required>
									<SelectTrigger>
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="dog">Dog</SelectItem>
										<SelectItem value="cat">Cat</SelectItem>
										<SelectItem value="bird">Bird</SelectItem>
										<SelectItem value="fish">Fish</SelectItem>
										<SelectItem value="small_pet">Small Pet</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Age Group</Label>
								<Select value={ageGroup} onValueChange={(v) => setAgeGroup(v || "")} required>
									<SelectTrigger>
										<SelectValue placeholder="Select age" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="puppy">Puppy/Kitten</SelectItem>
										<SelectItem value="adult">Adult</SelectItem>
										<SelectItem value="senior">Senior</SelectItem>
										<SelectItem value="all">All Ages</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="ingredients">Ingredients</Label>
							<Textarea id="ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="List ingredients..." rows={3} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="feeding_guide">Feeding Guide</Label>
							<Textarea id="feeding_guide" value={feedingGuide} onChange={(e) => setFeedingGuide(e.target.value)} placeholder="Add feeding instructions..." rows={3} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="image_urls">Image URLs (comma-separated)</Label>
							<Input id="image_urls" value={imageUrls} onChange={(e) => setImageUrls(e.target.value)} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
						</div>

						{error && <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-md">{error}</div>}
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Saving...
								</>
							) : mode === "create" ? (
								"Create Product"
							) : (
								"Save Changes"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
