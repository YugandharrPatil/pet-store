import { Card, CardContent } from "@/components/ui/card";
import { Cat, Dog, Heart, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="w-full bg-primary/10 py-16 md:py-24">
				<div className="container px-4 md:px-6 mx-auto text-center space-y-4">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">About PawfectPets</h1>
					<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">We believe every pet deserves the absolute best. Our mission is to provide premium quality products that make tails wag and motors purr.</p>
				</div>
			</section>

			{/* Our Story */}
			<section className="w-full py-16 md:py-24">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="space-y-6">
							<h2 className="text-3xl font-bold tracking-tighter">Our Story</h2>
							<p className="text-muted-foreground text-lg">Founded in 2024 by a team of passionate animal lovers, PawfectPets started with a simple belief: our pets are family, and they deserve family-quality care.</p>
							<p className="text-muted-foreground text-lg">
								We grew frustrated with the lack of transparent, high-quality, and affordable pet products on the market. That's why we set out to curate a selection of the finest food, most durable toys, and coziest beds, rigorously testing
								everything with our own furry friends first.
							</p>
						</div>
						<div className="relative aspect-video md:aspect-square overflow-hidden rounded-xl bg-muted border flex items-center justify-center">
							<div className="flex space-x-4 text-muted-foreground/50">
								<Dog className="h-32 w-32" />
								<Cat className="h-32 w-32" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Core Values */}
			<section className="w-full py-16 md:py-24 bg-muted/50">
				<div className="container px-4 md:px-6 mx-auto">
					<h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Our Core Values</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<Card className="bg-background">
							<CardContent className="p-6 text-center space-y-4">
								<div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full text-primary">
									<Heart className="h-6 w-6" />
								</div>
								<h3 className="text-xl font-semibold">Pet-First Philosophy</h3>
								<p className="text-muted-foreground">Every product we stock must pass our strict standards for pet health, safety, and happiness.</p>
							</CardContent>
						</Card>
						<Card className="bg-background">
							<CardContent className="p-6 text-center space-y-4">
								<div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full text-primary">
									<ShieldCheck className="h-6 w-6" />
								</div>
								<h3 className="text-xl font-semibold">Quality Guaranteed</h3>
								<p className="text-muted-foreground">We partner only with verified brands who share our commitment to transparent and ethical manufacturing.</p>
							</CardContent>
						</Card>
						<Card className="bg-background">
							<CardContent className="p-6 text-center space-y-4">
								<div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full text-primary">
									<Truck className="h-6 w-6" />
								</div>
								<h3 className="text-xl font-semibold">Fast & Reliable</h3>
								<p className="text-muted-foreground">We understand that running out of kibble is an emergency. That's why we ensure fast, reliable shipping on all orders.</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</div>
	);
}
