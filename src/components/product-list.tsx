"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	pet_type: string;
	age_group: string;
	image_urls: string[];
};

export default function ProductList() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

	// Filter state
	const type = searchParams.get("type") || "all";
	const age = searchParams.get("age") || "all";
	const sort = searchParams.get("sort") || "newest";

	const updateQueryParams = (key: string, value: string | null) => {
		const current = new URLSearchParams(Array.from(searchParams.entries()));
		if (!value || value === "all") {
			current.delete(key);
		} else {
			current.set(key, value);
		}
		// Reset page on filter change
		current.delete("page");
		setPage(1);
		router.push(`?${current.toString()}`, { scroll: false });
	};

	const { data, isLoading, isError } = useQuery({
		queryKey: ["products", { type, age, sort, search: searchParams.get("search"), page }],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (type !== "all") params.append("type", type);
			if (age !== "all") params.append("age", age);
			if (searchParams.get("search")) params.append("search", searchParams.get("search")!);
			if (sort !== "newest") params.append("sort", sort);
			params.append("page", page.toString());
			params.append("limit", "8");

			const { data } = await axios.get(`/api/products?${params.toString()}`);
			return data;
		},
		// Keep previous data while fetching new page for smoother UX
	});

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		updateQueryParams("search", searchTerm);
	};

	return (
		<div className="flex flex-col md:flex-row gap-8">
			{/* Sidebar Filters */}
			<div className="w-full md:w-64 space-y-6 shrink-0">
				<form onSubmit={handleSearch} className="flex gap-2">
					<Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
					<Button type="submit" size="icon" variant="secondary">
						<Search className="h-4 w-4" />
					</Button>
				</form>

				<div className="space-y-4">
					<div className="space-y-2">
						<label className="text-sm font-medium">Pet Type</label>
						<Select value={type} onValueChange={(val) => updateQueryParams("type", val)}>
							<SelectTrigger>
								<SelectValue placeholder="All Pets" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Pets</SelectItem>
								<SelectItem value="dog">Dogs</SelectItem>
								<SelectItem value="cat">Cats</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Age Group</label>
						<Select value={age} onValueChange={(val) => updateQueryParams("age", val)}>
							<SelectTrigger>
								<SelectValue placeholder="All Ages" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Ages</SelectItem>
								<SelectItem value="puppy">Puppy / Kitten</SelectItem>
								<SelectItem value="adult">Adult</SelectItem>
								<SelectItem value="senior">Senior</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Sort By</label>
						<Select value={sort} onValueChange={(val) => updateQueryParams("sort", val)}>
							<SelectTrigger>
								<SelectValue placeholder="Newest" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Newest Arrivals</SelectItem>
								<SelectItem value="price_asc">Price: Low to High</SelectItem>
								<SelectItem value="price_desc">Price: High to Low</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{isLoading ? (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="flex flex-col space-y-3">
								<Skeleton className="h-50 w-full rounded-xl" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-62.5" />
									<Skeleton className="h-4 w-50" />
								</div>
							</div>
						))}
					</div>
				) : isError ? (
					<div className="p-8 text-center text-destructive border rounded-lg bg-destructive/10">Failed to load products. Please try again later.</div>
				) : data?.data?.length === 0 ? (
					<div className="p-12 text-center border rounded-lg bg-muted/50">
						<h3 className="text-xl font-semibold mb-2">No products found</h3>
						<p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
						<Button variant="outline" onClick={() => router.push("/products")}>
							Clear Filters
						</Button>
					</div>
				) : (
					// success condition (render all products)
					<>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
							{data.data.map((product: Product) => (
								<Card key={product.id} className="flex flex-col overflow-hidden">
									<div className="aspect-square bg-muted relative">
										{product.image_urls?.[0] ? (
											<img src={product.image_urls[0]} alt={product.name} className="object-cover w-full h-full" />
										) : (
											<div className="absolute inset-0 flex items-center justify-center bg-secondary text-secondary-foreground font-semibold text-lg">{product.name.substring(0, 2)}</div>
										)}
									</div>
									<CardContent className="flex-1 p-4">
										<h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
										<p className="text-sm text-muted-foreground capitalize mb-2">
											{product.pet_type} • {product.age_group}
										</p>
										<p className="font-bold text-lg">${product.price.toFixed(2)}</p>
									</CardContent>
									<CardFooter className="p-4 pt-0">
										<Link href={`/products/${product.id}`} className="w-full">
											<Button className="w-full">View Details</Button>
										</Link>
									</CardFooter>
								</Card>
							))}
						</div>

						{/* Pagination Controls */}
						{data?.meta?.totalPages > 1 && (
							<div className="flex justify-center items-center space-x-4 mt-auto">
								<Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
									Previous
								</Button>
								<span className="text-sm font-medium">
									Page {page} of {data.meta.totalPages}
								</span>
								<Button variant="outline" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>
									Next
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
