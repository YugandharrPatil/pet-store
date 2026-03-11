import { CartSheet } from "@/components/cart-sheet";
import { CartSync } from "@/components/cart-sync";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Cat, Dog, LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

export async function Header() {
	const user = await currentUser();
	const isAdmin = user?.publicMetadata?.role === "admin";

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto flex h-16 items-center flex-wrap px-4 sm:px-8">
				<div className="mr-4 flex flex-1 items-center gap-2">
					<Link href={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2 mr-6 text-primary">
						<Dog className="h-6 w-6" />
						<Cat className="h-6 w-6" />
						<span className="font-bold text-xl inline-block text-primary">PawfectPets</span>
						{isAdmin && <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">Admin</span>}
					</Link>

					{!isAdmin && (
						<nav className="items-center space-x-6 text-sm font-medium hidden md:flex">
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
					)}

					{isAdmin && (
						<nav className="items-center space-x-6 text-sm font-medium hidden md:flex">
							<Link href="/admin" className="flex items-center space-x-2 transition-colors hover:text-foreground/80 text-foreground/60">
								<LayoutDashboard className="h-4 w-4" />
								<span>Dashboard</span>
							</Link>
							<Link href="/admin/products" className="flex items-center space-x-2 transition-colors hover:text-foreground/80 text-foreground/60">
								<Package className="h-4 w-4" />
								<span>Products</span>
							</Link>
							<Link href="/admin/orders" className="flex items-center space-x-2 transition-colors hover:text-foreground/80 text-foreground/60">
								<ShoppingBag className="h-4 w-4" />
								<span>Orders</span>
							</Link>
						</nav>
					)}
				</div>

				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-2">
						{!isAdmin && (
							<>
								<CartSync />
								{user && (
									<Link href="/orders">
										<Button variant="ghost" className="flex items-center gap-2">
											<Package className="h-5 w-5" />
											<span>Orders</span>
										</Button>
									</Link>
								)}
								<CartSheet />
							</>
						)}

						{!user ? (
							<div className="flex items-center gap-2">
								<Link href="/admin">
									<Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:inline-flex">
										Admin
									</Button>
								</Link>
								<SignInButton mode="modal">
									<Button variant="default">Sign In</Button>
								</SignInButton>
							</div>
						) : (
							<UserButton />
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}
