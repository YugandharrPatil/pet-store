import { AdminLoginForm } from "@/components/admin-login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const { userId } = await auth();

	if (!userId) {
		return (
			<div className="flex flex-1 items-center justify-center p-4 py-12">
				<AdminLoginForm />
			</div>
		);
	}

	// Verify admin role via public metadata
	const user = await currentUser();
	const role = user?.publicMetadata?.role;

	if (role !== "admin") {
		return (
			<div className="flex flex-1 items-center justify-center p-4 py-12">
				<Card className="max-w-md w-full">
					<CardHeader>
						<CardTitle className="text-destructive text-2xl">Unauthorized Access</CardTitle>
						<CardDescription>Your account does not have permission to view the admin dashboard.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col space-y-6">
						<p className="text-sm text-muted-foreground">Only users with the administrator role enabled can access this area.</p>
						<Link href="/" className="w-full">
							<Button className="w-full">Return to Homepage</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col">
			<main className="flex-1 p-6 md:p-10 bg-muted/10">{children}</main>
		</div>
	);
}
