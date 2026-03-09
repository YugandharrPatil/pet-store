import { Cat, Dog, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="w-full border-t bg-background px-4 py-8 md:px-8 lg:py-12">
			<div className="container mx-auto grid gap-8 md:grid-cols-4">
				<div className="space-y-4">
					<div className="flex items-center space-x-2 text-primary">
						<Dog className="h-6 w-6" />
						<Cat className="h-6 w-6" />
						<span className="font-bold text-xl">PawfectPets</span>
					</div>
					<p className="text-sm text-muted-foreground mr-4">Your one-stop shop for all your pet needs. Delivering happiness to your furry friends.</p>
				</div>

				<div className="space-y-4">
					<h3 className="font-semibold text-foreground">Shop</h3>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>
							<Link href="/products" className="hover:text-primary transition-colors">
								All Products
							</Link>
						</li>
						<li>
							<Link href="/products?type=dog" className="hover:text-primary transition-colors">
								For Dogs
							</Link>
						</li>
						<li>
							<Link href="/products?type=cat" className="hover:text-primary transition-colors">
								For Cats
							</Link>
						</li>
						<li>
							<Link href="/products?tag=sale" className="hover:text-primary transition-colors">
								Sale
							</Link>
						</li>
					</ul>
				</div>

				<div className="space-y-4">
					<h3 className="font-semibold text-foreground">Support</h3>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>
							<Link href="/contact" className="hover:text-primary transition-colors">
								Contact Us
							</Link>
						</li>
						<li>
							<Link href="/faq" className="hover:text-primary transition-colors">
								FAQ
							</Link>
						</li>
						<li>
							<Link href="/shipping" className="hover:text-primary transition-colors">
								Shipping Policy
							</Link>
						</li>
						<li>
							<Link href="/returns" className="hover:text-primary transition-colors">
								Returns
							</Link>
						</li>
					</ul>
				</div>

				<div className="space-y-4">
					<h3 className="font-semibold text-foreground">Connect With Us</h3>
					<div className="flex space-x-4">
						<Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
							<Facebook className="h-5 w-5" />
							<span className="sr-only">Facebook</span>
						</Link>
						<Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
							<Twitter className="h-5 w-5" />
							<span className="sr-only">Twitter</span>
						</Link>
						<Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
							<Instagram className="h-5 w-5" />
							<span className="sr-only">Instagram</span>
						</Link>
					</div>
				</div>
			</div>
			<div className="container mx-auto mt-8 border-t pt-8 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} PawfectPets Store. All rights reserved.</div>
		</footer>
	);
}
