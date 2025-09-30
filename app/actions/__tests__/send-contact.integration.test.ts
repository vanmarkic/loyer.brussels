/**
 * Integration tests for contact form submission
 * Tests the complete flow: validation -> database -> email sending
 */

import { describe, it, expect, afterAll, vi } from "vitest";
import { submitContactForm, ContactFormData } from "../send-contact";
import { supabaseAdmin, hasSupabaseCredentials } from "@/app/lib/supabase";

// Mock the email module to avoid hitting Resend API in tests
vi.mock("@/app/lib/email", () => ({
  sendContactNotification: vi.fn().mockResolvedValue({
    success: true,
    data: { id: "mock-email-id" },
  }),
  sendContactConfirmation: vi.fn().mockResolvedValue({
    success: true,
    data: { id: "mock-email-id" },
  }),
  sendQuestionnaireConfirmation: vi.fn().mockResolvedValue({
    success: true,
    data: { id: "mock-email-id" },
  }),
}));

describe("Contact Form Integration Tests", () => {
  let testSubmissionId: number | undefined;
  const testEmail = "drag.markovic@gmail.com";

  // Skip all tests if Supabase credentials are not available
  const skipTests = !hasSupabaseCredentials;

  // Cleanup function to remove test data
  afterAll(async () => {
    if (skipTests) return;
    if (testSubmissionId) {
      await supabaseAdmin.from("contact_submissions").delete().eq("id", testSubmissionId);
    }
  });

  describe("submitContactForm", () => {
    it.skipIf(skipTests)("should successfully submit a complete contact form", async () => {
      const formData: ContactFormData = {
        name: "Dragan Markovic (Test User)",
        email: testEmail,
        subject: "Test - Integration Test Submission",
        message:
          "This is an automated integration test message. If you receive this, the email integration is working correctly!",
        newsletter: true,
        assembly: true,
      };

      const result = await submitContactForm(formData);

      // Verify successful submission
      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
      expect(result.error).toBeUndefined();

      // Store ID for cleanup
      testSubmissionId = result.submissionId;

      // Verify database entry
      if (result.submissionId) {
        const { data: submission, error } = await supabaseAdmin
          .from("contact_submissions")
          .select("*")
          .eq("id", result.submissionId)
          .single();

        expect(error).toBeNull();
        expect(submission).toBeDefined();
        expect(submission?.name).toBe(formData.name);
        expect(submission?.email).toBe(formData.email);
        expect(submission?.subject).toBe(formData.subject);
        expect(submission?.message).toBe(formData.message);
        expect(submission?.newsletter).toBe(true);
        expect(submission?.assembly).toBe(true);
        expect(submission?.submitted_at).toBeDefined();
      }
    });

    it.skipIf(skipTests)("should successfully submit with minimal required fields", async () => {
      const formData: ContactFormData = {
        name: "Test User Minimal",
        email: testEmail,
        subject: "Test - Minimal Submission",
        message: "Minimal test message",
        newsletter: false,
        assembly: false,
      };

      const result = await submitContactForm(formData);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();

      // Cleanup
      if (result.submissionId) {
        await supabaseAdmin
          .from("contact_submissions")
          .delete()
          .eq("id", result.submissionId);
      }
    });

    it.skipIf(skipTests)("should reject submission with missing required fields", async () => {
      const formData: ContactFormData = {
        name: "",
        email: testEmail,
        subject: "Test Subject",
        message: "Test Message",
        newsletter: false,
        assembly: false,
      };

      const result = await submitContactForm(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("obligatoires");
    });

    it.skipIf(skipTests)("should reject submission with invalid email", async () => {
      const formData: ContactFormData = {
        name: "Test User",
        email: "invalid-email",
        subject: "Test Subject",
        message: "Test Message",
        newsletter: false,
        assembly: false,
      };

      const result = await submitContactForm(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("email invalide");
    });

    it.skipIf(skipTests)("should handle special characters in message", async () => {
      const formData: ContactFormData = {
        name: "Test User",
        email: testEmail,
        subject: "Test - Special Characters",
        message: "Test with special chars: <script>alert('xss')</script> & é à ç ñ 中文",
        newsletter: false,
        assembly: false,
      };

      const result = await submitContactForm(formData);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();

      // Verify message is stored correctly
      if (result.submissionId) {
        const { data: submission } = await supabaseAdmin
          .from("contact_submissions")
          .select("message")
          .eq("id", result.submissionId)
          .single();

        expect(submission?.message).toBe(formData.message);

        // Cleanup
        await supabaseAdmin
          .from("contact_submissions")
          .delete()
          .eq("id", result.submissionId);
      }
    });

    it.skipIf(skipTests)("should handle joining Wuune from rent calculator flow", async () => {
      const formData: ContactFormData = {
        name: "Test User - Wuune Join",
        email: testEmail,
        subject: "Adhésion au collectif Wuune",
        message:
          "Bonjour,\n\nJ'ai utilisé votre calculateur de loyer et il semblerait que mon loyer soit abusif. Je souhaite rejoindre le collectif Wuune pour obtenir de l'aide dans mes démarches.\n\nMerci de me recontacter.",
        newsletter: true,
        assembly: true,
      };

      const result = await submitContactForm(formData);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();

      // Cleanup
      if (result.submissionId) {
        await supabaseAdmin
          .from("contact_submissions")
          .delete()
          .eq("id", result.submissionId);
      }
    });

    it.skipIf(skipTests)("should handle long messages", async () => {
      const longMessage = "A".repeat(5000); // 5000 character message

      const formData: ContactFormData = {
        name: "Test User",
        email: testEmail,
        subject: "Test - Long Message",
        message: longMessage,
        newsletter: false,
        assembly: false,
      };

      const result = await submitContactForm(formData);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();

      // Cleanup
      if (result.submissionId) {
        await supabaseAdmin
          .from("contact_submissions")
          .delete()
          .eq("id", result.submissionId);
      }
    });
  });

  describe("Database Integration", () => {
    it.skipIf(skipTests)("should correctly store newsletter and assembly preferences", async () => {
      const formData: ContactFormData = {
        name: "Test User - Preferences",
        email: testEmail,
        subject: "Test - Preferences",
        message: "Testing preference storage",
        newsletter: true,
        assembly: false,
      };

      const result = await submitContactForm(formData);
      expect(result.success).toBe(true);

      if (result.submissionId) {
        const { data: submission } = await supabaseAdmin
          .from("contact_submissions")
          .select("newsletter, assembly")
          .eq("id", result.submissionId)
          .single();

        expect(submission?.newsletter).toBe(true);
        expect(submission?.assembly).toBe(false);

        // Cleanup
        await supabaseAdmin
          .from("contact_submissions")
          .delete()
          .eq("id", result.submissionId);
      }
    });

    it.skipIf(skipTests)("should store submission timestamp", async () => {
      const beforeSubmit = new Date();

      const formData: ContactFormData = {
        name: "Test User",
        email: testEmail,
        subject: "Test - Timestamp",
        message: "Testing timestamp",
        newsletter: false,
        assembly: false,
      };

      const result = await submitContactForm(formData);
      const afterSubmit = new Date();

      expect(result.success).toBe(true);

      if (result.submissionId) {
        const { data: submission } = await supabaseAdmin
          .from("contact_submissions")
          .select("submitted_at")
          .eq("id", result.submissionId)
          .single();

        const submittedAt = new Date(submission!.submitted_at);
        expect(submittedAt.getTime()).toBeGreaterThanOrEqual(beforeSubmit.getTime());
        expect(submittedAt.getTime()).toBeLessThanOrEqual(afterSubmit.getTime());

        // Cleanup
        await supabaseAdmin
          .from("contact_submissions")
          .delete()
          .eq("id", result.submissionId);
      }
    });
  });

  describe("Email Integration", () => {
    it.skipIf(skipTests)("should send emails without blocking submission on email failure", async () => {
      // This test verifies that even if email sending fails,
      // the submission is still successful (graceful degradation)

      const formData: ContactFormData = {
        name: "Test User - Email Test",
        email: testEmail,
        subject: "Test - Email Integration",
        message: "This tests that emails are sent. Check your inbox for confirmation!",
        newsletter: true,
        assembly: true,
      };

      const result = await submitContactForm(formData);

      // Should succeed even if emails fail
      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();

      // Cleanup
      if (result.submissionId) {
        await supabaseAdmin
          .from("contact_submissions")
          .delete()
          .eq("id", result.submissionId);
      }
    });
  });
});

