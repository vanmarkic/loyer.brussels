"use server";

import { supabaseAdmin } from "@/app/lib/supabase";
import {
  sendContactNotification,
  sendContactConfirmation,
  ContactEmailData,
} from "@/app/lib/email";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletter: boolean;
  assembly: boolean;
}

export interface ContactSubmissionResult {
  success: boolean;
  error?: string;
  submissionId?: number;
}

/**
 * Server action to handle contact form submission
 * Stores data in Supabase and sends emails
 */
export async function submitContactForm(
  formData: ContactFormData
): Promise<ContactSubmissionResult> {
  try {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return {
        success: false,
        error: "Tous les champs obligatoires doivent être remplis.",
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        error: "Adresse email invalide.",
      };
    }

    // Store in database
    const { data: submission, error: dbError } = await supabaseAdmin
      .from("contact_submissions")
      .insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          newsletter: formData.newsletter,
          assembly: formData.assembly,
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return {
        success: false,
        error: "Erreur lors de l'enregistrement. Veuillez réessayer.",
      };
    }

    // Send notification email to admin
    const emailData: ContactEmailData = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      newsletter: formData.newsletter,
      assembly: formData.assembly,
    };

    const notificationResult = await sendContactNotification(emailData);
    if (!notificationResult.success) {
      console.error("Failed to send notification email:", notificationResult.error);
      // Don't fail the submission if email fails
    }

    // Send confirmation email to user
    const confirmationResult = await sendContactConfirmation(emailData);
    if (!confirmationResult.success) {
      console.error("Failed to send confirmation email:", confirmationResult.error);
      // Don't fail the submission if email fails
    }

    return {
      success: true,
      submissionId: submission.id,
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    };
  }
}
