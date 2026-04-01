"use server";

import { supabase } from "@/lib/supabase";

export async function submitContactMessage(data: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { error } = await supabase
    .from("pet_messages" as any)
    .insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
