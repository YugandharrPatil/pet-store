"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteProductButtonProps {
	productId: string;
	productName: string;
	deleteAction: (formData: FormData) => Promise<void>;
}

export function DeleteProductButton({ productId, productName, deleteAction }: DeleteProductButtonProps) {
	const [open, setOpen] = useState(false);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className="text-destructive hover:text-destructive hover:bg-destructive/10"
					/>
				}
			>
				<Trash2 className="h-4 w-4" />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Product</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<form
						action={async (formData) => {
							await deleteAction(formData);
							setOpen(false);
						}}
					>
						<input type="hidden" name="id" value={productId} />
						<AlertDialogAction type="submit" variant="destructive" className="w-full">
							Delete
						</AlertDialogAction>
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
