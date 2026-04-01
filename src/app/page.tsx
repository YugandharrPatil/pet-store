import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TABLES } from "@/lib/constants/db-tables";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Force dynamic rendering to prevent build errors without env vars
export const dynamic = "force-dynamic";

export default async function HomePage() {
	// Fetch some featured products
	const { data: featuredProducts } = await supabase.from(TABLES.PRODUCTS).select("*").limit(4);

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="w-full bg-primary/10 py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-4">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">Everything Your Pet Loves</h1>
						<p className="mx-auto max-w-175 text-muted-foreground md:text-xl">Discover premium food, toys, and accessories for your furry friends. Quality products for healthy and happy pets.</p>
					</div>
					<div className="space-x-4">
						<Link href="/products">
							<Button size="lg" variant="default">
								Shop All Products
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="w-full py-12 bg-muted/50">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-3xl font-bold tracking-tighter">Featured Products</h2>
						<Link href="/products">
							<Button variant="ghost">View All</Button>
						</Link>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{featuredProducts?.map((product) => (
							<Card key={product.id} className="flex flex-col overflow-hidden">
								<div className="aspect-square bg-muted relative">
									{/* Fallback pattern if no image */}
									{product.image_urls?.[0] ? (
										<img src={product.image_urls[0]} alt={product.name} className="object-cover w-full h-full" />
									) : (
										<div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary text-secondary-foreground space-y-2">
											<span className="font-semibold text-lg">{product.name.substring(0, 2)}</span>
										</div>
									)}
								</div>
								<CardContent className="flex-1 p-4">
									<h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
									<p className="text-sm text-muted-foreground capitalize">
										{product.pet_type} • {product.age_group}
									</p>
								</CardContent>
								<CardFooter className="p-4 pt-0 flex items-center justify-between">
									<span className="font-bold">${product.price.toFixed(2)}</span>
									<Link href={`/products/${product.id}`}>
										<Button size="sm">Details</Button>
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
