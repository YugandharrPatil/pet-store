import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<section className="w-full bg-primary/10 py-16">
				<div className="container px-4 md:px-6 mx-auto text-center space-y-4">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">Contact Us</h1>
					<p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">Have a question about a product or your order? Our team of pet lovers is here to help.</p>
				</div>
			</section>

			<section className="w-full py-16 md:py-24">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="grid md:grid-cols-2 gap-12 lg:gap-24">
						{/* Contact Form */}
						<div className="space-y-8">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter">Get in Touch</h2>
								<p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
							</div>

							<form className="space-y-4">
								<div className="grid sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="first-name">First name</Label>
										<Input id="first-name" placeholder="John" required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="last-name">Last name</Label>
										<Input id="last-name" placeholder="Doe" required />
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" placeholder="john@example.com" required />
								</div>
								<div className="space-y-2">
									<Label htmlFor="subject">Subject</Label>
									<Input id="subject" placeholder="How can we help you?" required />
								</div>
								<div className="space-y-2">
									<Label htmlFor="message">Message</Label>
									<Textarea id="message" placeholder="Your message here..." className="min-h-[150px]" required />
								</div>
								<Button type="button" className="w-full" size="lg">
									Send Message
								</Button>
							</form>
						</div>

						{/* Contact Info */}
						<div className="space-y-8 lg:mt-0 mt-8">
							<Card>
								<CardHeader>
									<CardTitle>Other Ways to Reach Us</CardTitle>
									<CardDescription>We're available Monday-Friday, 9am-6pm EST.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="flex items-start space-x-4">
										<Mail className="h-6 w-6 text-primary mt-0.5" />
										<div className="space-y-1">
											<h3 className="font-semibold">Email Us</h3>
											<p className="text-sm text-muted-foreground">support@pawfectpets.com</p>
											<p className="text-sm text-muted-foreground">wholesale@pawfectpets.com</p>
										</div>
									</div>
									<div className="flex items-start space-x-4">
										<Phone className="h-6 w-6 text-primary mt-0.5" />
										<div className="space-y-1">
											<h3 className="font-semibold">Call Us</h3>
											<p className="text-sm text-muted-foreground">1-800-PAWFECT (1-800-729-3328)</p>
										</div>
									</div>
									<div className="flex items-start space-x-4">
										<MapPin className="h-6 w-6 text-primary mt-0.5" />
										<div className="space-y-1">
											<h3 className="font-semibold">Visit Our HQ</h3>
											<p className="text-sm text-muted-foreground">123 Pet Avenue, Suite 400</p>
											<p className="text-sm text-muted-foreground">New York, NY 10001</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<div className="bg-muted rounded-xl p-8 text-center space-y-4">
								<h3 className="font-semibold text-lg">Looking for returns?</h3>
								<p className="text-sm text-muted-foreground">Check out our return policy page for quick instructions on how to process a return or exchange within 30 days of your purchase.</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
