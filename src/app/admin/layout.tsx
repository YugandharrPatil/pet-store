import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const { sessionClaims } = await auth();

	// Verify admin role via custom Clerk metadata
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// To test admin panel easily without clerk metadata, you can bypass this
	// by uncommenting `if (false)` or setting your clerk user metadata { "role": "admin" }.
	if (role !== "admin") {
		redirect("/");
	}

	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
			<aside className="w-full md:w-64 border-r bg-muted/40 p-6 md:min-h-full">
				<h2 className="font-bold text-lg mb-6 tracking-tight">Admin Panel</h2>
				<nav className="space-y-2 flex flex-col">
					<Link href="/admin" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-md transition-colors">
						<LayoutDashboard className="h-5 w-5" />
						<span>Dashboard</span>
					</Link>
					<Link href="/admin/products" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-md transition-colors">
						<Package className="h-5 w-5" />
						<span>Products</span>
					</Link>
					<Link href="/admin/orders" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-md transition-colors">
						<ShoppingBag className="h-5 w-5" />
						<span>Orders</span>
					</Link>
				</nav>
			</aside>
			<main className="flex-1 p-6 md:p-10 bg-muted/10">{children}</main>
		</div>
	);
}
