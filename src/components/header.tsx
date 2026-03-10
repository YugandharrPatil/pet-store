import { CartSheet } from "@/components/cart-sheet";
import { CartSync } from "@/components/cart-sync";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Cat, Dog, Package } from "lucide-react";
import Link from "next/link";

export async function Header() {
	const { userId } = await auth();
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center flex-wrap px-4 sm:px-8">
				<div className="mr-4 flex flex-1 items-center gap-2">
					<Link href="/" className="flex items-center space-x-2 mr-6 text-primary">
						<Dog className="h-6 w-6" />
						<Cat className="h-6 w-6" />
						<span className="font-bold text-xl inline-block text-primary">PawfectPets</span>
					</Link>
					<nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
						<Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
							Home
						</Link>
						<Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">
							Products
						</Link>
						<Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
							About
						</Link>
						<Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
							Contact
						</Link>
					</nav>
				</div>
				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-2">
						<CartSync />
						{userId && (
							<Link href="/orders">
								<Button variant="ghost" className="flex items-center gap-2">
									<Package className="h-5 w-5" />
									<span>Orders</span>
								</Button>
							</Link>
						)}
						<CartSheet />

						{!userId ? (
							<SignInButton mode="modal">
								<Button variant="default">Sign In</Button>
							</SignInButton>
						) : (
							<UserButton />
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}
