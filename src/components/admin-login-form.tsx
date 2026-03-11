"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";

export function AdminLoginForm() {
	const clerk = useClerk();
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleAutofill = () => {
		setEmailAddress("admin@pet-store.com");
		setPassword("admin123");
	};

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);
		setError("");

		try {
			const result = await clerk.client.signIn.create({
				identifier: emailAddress,
				password: password,
			});

			if (result.status === "complete") {
				await clerk.setActive({ session: result.createdSessionId });
				// Force a hard navigation to bypass Clerk's default redirects
				window.location.href = "/admin";
			} else {
				console.log("Investigate additional flows", result);
				setError("Additional verification required that is not supported by this dummy login.");
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error("error", err.errors?.[0]?.longMessage || err);
			setError(err.errors?.[0]?.longMessage || "Failed to sign in. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full items-center justify-center p-4">
			<Card className="w-full max-w-sm shrink-0">
				<CardHeader>
					<CardTitle className="text-2xl">Admin Credentials</CardTitle>
					<CardDescription>Use the following demonstration credentials to log in.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="bg-muted p-4 rounded-md font-mono text-sm space-y-4">
						<div className="flex flex-col space-y-1">
							<span className="text-muted-foreground text-xs font-semibold uppercase">Email Account</span>
							<span className="font-semibold select-all">admin@pet-store.com</span>
						</div>
						<div className="flex flex-col space-y-1">
							<span className="text-muted-foreground text-xs font-semibold uppercase">Password</span>
							<span className="font-semibold select-all">admin123</span>
						</div>
					</div>
					<Button variant="secondary" className="w-full" onClick={handleAutofill}>
						Autofill Credentials
					</Button>
				</CardContent>
			</Card>

			<Card className="w-full max-w-md shrink-0 border-primary/20 shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
					<CardDescription>Sign in to access the dashboard</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={submit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required placeholder="Enter email address" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
						</div>

						{error && <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-md">{error}</div>}

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Signing in..." : "Sign In"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
