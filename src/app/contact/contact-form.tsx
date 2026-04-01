"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { submitContactMessage } from "./actions";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters."),
	lastName: z.string().min(2, "Last name must be at least 2 characters."),
	email: z.email("Invalid email address."),
	subject: z.string().min(2, "Subject must be at least 2 characters."),
	message: z.string().min(10, "Message must be at least 10 characters."),
});

export function ContactForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		// @ts-expect-error - zod types mismatch with @hookform/resolvers latest version, works perfectly fine in runtime
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			subject: "",
			message: "",
		},
	});

	const { isSubmitting } = form.formState;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await submitContactMessage(values);
			toast.success("Message Sent!", {
				description: "Thank you for contacting us. We will get back to you shortly.",
			});
			form.reset();
		} catch (error) {
			console.error(error);
			toast.error("Error", {
				description: "Failed to send the message. Please try again.",
			});
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<FieldGroup>
				<div className="grid sm:grid-cols-2 gap-4">
					<Controller
						name="firstName"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="firstName">First name</FieldLabel>
								<Input {...field} id="firstName" aria-invalid={fieldState.invalid} placeholder="John" />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="lastName"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="lastName">Last name</FieldLabel>
								<Input {...field} id="lastName" aria-invalid={fieldState.invalid} placeholder="Doe" />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</div>

				<Controller
					name="email"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input {...field} id="email" type="email" aria-invalid={fieldState.invalid} placeholder="john@example.com" />
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="subject"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="subject">Subject</FieldLabel>
							<Input {...field} id="subject" aria-invalid={fieldState.invalid} placeholder="How can we help you?" />
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="message"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="message">Message</FieldLabel>
							<Textarea {...field} id="message" aria-invalid={fieldState.invalid} placeholder="Your message here..." className="min-h-37.5" />
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>

			<Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
				{isSubmitting ? "Sending..." : "Send Message"}
			</Button>
		</form>
	);
}
