import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Providers from "@/components/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Pet Store Ecommerce",
	description: "A modern pet store built with Next.js",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}>
				<Providers>
					<Header />
					<main className="flex-1 flex flex-col">{children}</main>
					<Footer />
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}
