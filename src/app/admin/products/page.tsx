import { DeleteProductButton } from "@/components/delete-product-button";
import { ProductFormDialog } from "@/components/product-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TABLES } from "@/lib/constants/db-tables";
import { supabase } from "@/lib/supabase";

import { revalidatePath } from "next/cache";

export default async function AdminProductsPage() {


	const { data: products } = await supabase.from(TABLES.PRODUCTS).select("*").order("created_at", { ascending: false });

	// Server Action for deleting product
	async function deleteProduct(formData: FormData) {
		"use server";
		const id = formData.get("id") as string;



		await supabase.from(TABLES.PRODUCTS).delete().eq("id", id);
		revalidatePath("/admin/products");
		revalidatePath("/products");
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
					<p className="text-muted-foreground mt-2">Manage your catalog, stock, and pricing.</p>
				</div>
				<ProductFormDialog mode="create" />
			</div>

			<div className="rounded-md border bg-background">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Product Name</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Stock</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!products || products.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
									No products found.
								</TableCell>
							</TableRow>
						) : (
							products.map((product) => (
								<TableRow key={product.id}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											{product.image_urls?.[0] ? <img src={product.image_urls[0]} className="h-10 w-10 object-cover rounded" alt="" /> : <div className="h-10 w-10 bg-muted rounded"></div>}
											<span className="truncate max-w-[200px]">{product.name}</span>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="capitalize">
											{product.pet_type}
										</Badge>
									</TableCell>
									<TableCell>${product.price.toFixed(2)}</TableCell>
									<TableCell>
										{product.stock > 10 ? (
											<span className="text-green-600 font-medium">{product.stock}</span>
										) : product.stock > 0 ? (
											<span className="text-amber-500 font-medium">{product.stock}</span>
										) : (
											<span className="text-destructive font-medium">Out of stock</span>
										)}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-1">
											<ProductFormDialog mode="edit" product={product} />
											<DeleteProductButton productId={product.id} productName={product.name} deleteAction={deleteProduct} />
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
