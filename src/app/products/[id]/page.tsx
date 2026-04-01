import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { TABLES } from "@/lib/constants/db-tables";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const { data: product, error } = await supabase.from(TABLES.PRODUCTS).select("*").eq("id", id).single();

	if (error || !product) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<div className="mb-6">
				<Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Products
				</Link>
			</div>

			<div className="grid md:grid-cols-2 gap-8 lg:gap-12">
				{/* Image Gallery */}
				<div className="w-full relative">
					{product.image_urls && product.image_urls?.length > 0 ? (
						<Carousel className="w-full">
							<CarouselContent>
								{product.image_urls.map((url: string, i: number) => (
									<CarouselItem key={i}>
										<div className="aspect-square relative overflow-hidden rounded-xl border bg-muted flex items-center justify-center">
											<img src={url} alt={`${product.name} - Image ${i + 1}`} className="object-cover w-full h-full" />
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							{product.image_urls.length > 1 && (
								<>
									<CarouselPrevious className="left-4" />
									<CarouselNext className="right-4" />
								</>
							)}
						</Carousel>
					) : (
						<div className="aspect-square relative overflow-hidden rounded-xl border bg-muted flex items-center justify-center">
							<span className="text-muted-foreground font-semibold text-xl">No Image</span>
						</div>
					)}
				</div>

				{/* Product Details */}
				<div className="flex flex-col space-y-6">
					<div className="space-y-2">
						<div className="flex items-center gap-2 mb-2">
							<Badge variant="secondary" className="capitalize">
								{product.pet_type}
							</Badge>
							<Badge variant="outline" className="capitalize">
								{product.age_group}
							</Badge>
						</div>
						<h1 className="text-3xl sm:text-4xl font-bold">{product.name}</h1>
						<p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
					</div>

					<p className="text-muted-foreground leading-relaxed">{product.description}</p>

					<Separator />

					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<span className="font-medium min-w-25">Stock Status:</span>
							{product.stock > 0 ? <Badge className="bg-green-600 hover:bg-green-700">In Stock ({product.stock})</Badge> : <Badge variant="destructive">Out of Stock</Badge>}
						</div>
					</div>

					<AddToCartButton product={product} />

					{/* Pet Info Accordion vs block */}
					<div className="space-y-4 pt-2">
						<div>
							<h3 className="font-semibold text-lg mb-2">Ingredients</h3>
							<p className="text-sm text-muted-foreground">{product.ingredients || "No ingredients listed."}</p>
						</div>
						<div>
							<h3 className="font-semibold text-lg mb-2">Feeding Guide</h3>
							<p className="text-sm text-muted-foreground">{product.feeding_guide || "No feeding guide provided."}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
