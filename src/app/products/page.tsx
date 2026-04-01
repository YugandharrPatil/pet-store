import ProductList from "@/components/product-list";
import { Suspense } from "react";

export default function ProductsPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col space-y-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Our Products</h1>
					<p className="text-muted-foreground mt-2">Browse our collection of premium pet food, toys, and accessories.</p>
				</div>

				{/* The client component dealing with React Query and Filters */}
				<Suspense fallback={<div>Loading catalogue...</div>}>
					<ProductList />
				</Suspense>
			</div>
		</div>
	);
}
