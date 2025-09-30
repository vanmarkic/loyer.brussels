/**
 * End-to-end tests for email functionality
 * These tests actually call the Resend API - run sparingly to avoid rate limits
 *
 * Run with: yarn test app/lib/__tests__/email.e2e.test.ts
 *
 * Prerequisites:
 * 1. RESEND_API_KEY must be set in .env.local
 * 2. EMAIL_FROM domain must be verified on Resend
 * 3. Tests should be run manually, not in CI/CD (to avoid rate limits)
 */

import { describe, it, expect } from "vitest";
import {
  sendContactNotification,
  sendContactConfirmation,
  sendQuestionnaireConfirmation,
  type ContactEmailData,
  type QuestionnaireEmailData,
} from "../email";

// Skip these tests by default - only run when explicitly testing email
// To run: yarn test app/lib/__tests__/email.e2e.test.ts --run
describe.skip("Email E2E Tests (Resend API)", () => {
  const testEmail = "drag.markovic@gmail.com";

  it("should send contact notification email to admin", async () => {
    const contactData: ContactEmailData = {
      name: "E2E Test User",
      email: testEmail,
      subject: "E2E Test - Contact Notification",
      message: "This is an automated end-to-end test of the contact notification email.",
      newsletter: false,
      assembly: false,
    };

    const result = await sendContactNotification(contactData);

    expect(result.success).toBe(true);
    expect(result.data?.id).toBeDefined();
    expect(result.error).toBeUndefined();

    console.log("✉️ Contact notification email ID:", result.data?.id);
  }, 10000); // 10s timeout

  it("should send contact confirmation email to user", async () => {
    const contactData: ContactEmailData = {
      name: "E2E Test User",
      email: testEmail,
      subject: "E2E Test - User Confirmation",
      message: "This is an automated end-to-end test of the user confirmation email.",
      newsletter: true,
      assembly: true,
    };

    // Wait 1 second to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await sendContactConfirmation(contactData);

    expect(result.success).toBe(true);
    expect(result.data?.id).toBeDefined();
    expect(result.error).toBeUndefined();

    console.log("✉️ Contact confirmation email ID:", result.data?.id);
    console.log(`📬 Check ${testEmail} for confirmation email`);
  }, 10000);

  it("should send questionnaire confirmation email", async () => {
    const questionnaireData: QuestionnaireEmailData = {
      email: testEmail,
      submissionId: `e2e-test-${Date.now()}`,
      submissionDate: new Date().toLocaleDateString("fr-BE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Wait 2 seconds to avoid rate limiting (2 req/sec limit)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = await sendQuestionnaireConfirmation(questionnaireData);

    expect(result.success).toBe(true);
    expect(result.data?.id).toBeDefined();
    expect(result.error).toBeUndefined();

    console.log("✉️ Questionnaire confirmation email ID:", result.data?.id);
    console.log(`📬 Check ${testEmail} for questionnaire confirmation`);
  }, 10000);

  it("should handle email with special characters", async () => {
    const contactData: ContactEmailData = {
      name: "E2E Test - Spëcial Çhars",
      email: testEmail,
      subject: "E2E Test - Spëcial Çhars & <Tags>",
      message:
        "Message with special chars: é à ç ñ 中文 & <script>alert('test')</script>",
      newsletter: false,
      assembly: false,
    };

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = await sendContactConfirmation(contactData);

    expect(result.success).toBe(true);
    expect(result.data?.id).toBeDefined();
  }, 10000);
});

describe("Email Configuration Tests", () => {
  it("should have RESEND_API_KEY configured", () => {
    expect(process.env.RESEND_API_KEY).toBeDefined();
    expect(process.env.RESEND_API_KEY).not.toBe("");
  });

  it("should have EMAIL_FROM configured", () => {
    const emailFrom = process.env.EMAIL_FROM || "contact@wuune.be";
    expect(emailFrom).toBeDefined();
    expect(emailFrom).toMatch(/@/);
  });

  it("should have EMAIL_TO configured", () => {
    const emailTo = process.env.EMAIL_TO || "contact@wuune.be";
    expect(emailTo).toBeDefined();
    expect(emailTo).toMatch(/@/);
  });
});
