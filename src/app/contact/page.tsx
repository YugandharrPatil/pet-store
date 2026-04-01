import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./contact-form";

export default function ContactPage() {
	return (
		<div className="flex flex-col min-h-screen">
			<section className="w-full bg-primary/10 py-16">
				<div className="container px-4 md:px-6 mx-auto text-center space-y-4">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">Contact Us</h1>
					<p className="mx-auto max-w-150 text-muted-foreground md:text-xl">Have a question about a product or your order? Our team of pet lovers is here to help.</p>
				</div>
			</section>

			<section className="w-full py-16 md:py-24">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="grid md:grid-cols-2 gap-12 lg:gap-24">
						{/* Contact Form */}
						<div className="space-y-8">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter">Get in Touch</h2>
								<p className="text-muted-foreground">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
							</div>

							<ContactForm />
						</div>

						{/* Contact Info */}
						<div className="space-y-8 lg:mt-0 mt-8">
							<Card>
								<CardHeader>
									<CardTitle>Other Ways to Reach Us</CardTitle>
									<CardDescription>We&apos;re available Monday-Friday, 9am-6pm EST.</CardDescription>
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
