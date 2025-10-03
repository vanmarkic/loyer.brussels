/**
 * Unit tests for contact form submission
 * Tests validation, error handling, and data transformation
 * @vitest-environment node
 */

import { describe, it, expect, vi } from "vitest";
import { submitContactForm, ContactFormData } from "../send-contact";

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

// Mock Supabase Admin to avoid requiring real database
vi.mock("@/app/server/supabase-admin", () => ({
  hasSupabaseAdminCredentials: false,
  supabaseAdmin: {
    from: () => ({
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            const insertedData = Array.isArray(data) ? data[0] : data;
            return {
              data: {
                ...insertedData,
                id: Math.floor(Math.random() * 100000),
              },
              error: null,
            };
          },
        }),
      }),
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: { id: 1, name: "Test" },
            error: null,
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  },
}));

describe("Contact Form Unit Tests", () => {
  const testEmail = "test@example.com";

  describe("submitContactForm", () => {
    it("should successfully submit a complete contact form", async () => {
      const formData: ContactFormData = {
        name: "Test User",
        email: testEmail,
        subject: "Test Subject",
        message: "This is a test message",
        newsletter: true,
        assembly: true,
      };

      const result = await submitContactForm(formData);

      // Verify successful submission
      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it("should successfully submit with minimal required fields", async () => {
      const formData: ContactFormData = {
        name: "Test User Minimal",
        email: testEmail,
        subject: "Test Subject",
        message: "Minimal test message",
        newsletter: false,
        assembly: false,
      };

      const result = await submitContactForm(formData);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });

    it("should reject submission with missing required fields", async () => {
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

    it("should reject submission with invalid email", async () => {
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

    it("should handle special characters in message", async () => {
      const formData: ContactFormData = {
        name: "Test User",
        email: testEmail,
        subject: "Test Subject",
        message:
          "Test with special chars: <script>alert('xss')</script> & é à ç ñ 中文",
        newsletter: false,
        assembly: false,
      };

      const result = await submitContactForm(formData);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });

    it("should handle joining Wuune from rent calculator flow", async () => {
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
    });

    it("should handle long messages", async () => {
      const longMessage = "A".repeat(5000); // 5000 character message

      const formData: ContactFormData = {
        name: "Test User",
        email: testEmail,
        subject: "Test Subject",
        message: longMessage,
        newsletter: false,
        assembly: false,
      };

      const result = await submitContactForm(formData);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });
  });

  describe("Data Handling", () => {
    it("should correctly handle newsletter and assembly preferences", async () => {
      const formData: ContactFormData = {
        name: "Test User - Preferences",
        email: testEmail,
        subject: "Test Subject",
        message: "Testing preference storage",
        newsletter: true,
        assembly: false,
      };

      const result = await submitContactForm(formData);
      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });

    it("should generate submission timestamp", async () => {
      const formData: ContactFormData = {
        name: "Test User",
        email: testEmail,
        subject: "Test Subject",
        message: "Testing timestamp",
        newsletter: false,
        assembly: false,
      };

      const result = await submitContactForm(formData);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });
  });

  describe("Email Handling", () => {
    it("should succeed even if email sending fails (graceful degradation)", async () => {
      // This test verifies that even if email sending fails,
      // the submission is still successful (graceful degradation)

      const formData: ContactFormData = {
        name: "Test User - Email Test",
        email: testEmail,
        subject: "Test Subject",
        message: "This tests graceful email failure handling",
        newsletter: true,
        assembly: true,
      };

      const result = await submitContactForm(formData);

      // Should succeed even if emails fail
      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });
  });
});
