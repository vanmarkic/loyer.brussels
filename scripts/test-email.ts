/**
 * Manual script to test Resend email functionality
 * Run with: npx tsx scripts/test-email.ts
 * 
 * This script sends real test emails to verify:
 * 1. Resend API key is configured
 * 2. Domain is verified (or using a verified test domain)
 * 3. Email templates render correctly
 * 4. Emails are actually delivered
 */

import { 
  sendContactNotification, 
  sendContactConfirmation,
  sendQuestionnaireConfirmation,
  type ContactEmailData,
  type QuestionnaireEmailData 
} from "../app/lib/email";

async function testContactEmails() {
  console.log("🧪 Testing Contact Form Emails...\n");
  
  const testContactData: ContactEmailData = {
    name: "Test User",
    email: "drag.markovic@gmail.com", // Replace with your email
    subject: "Email Integration Test",
    message: "This is a test email from the Loyer.Brussels application to verify Resend integration is working correctly.",
    newsletter: true,
    assembly: true,
  };

  // Test admin notification
  console.log("📧 Sending admin notification...");
  const notificationResult = await sendContactNotification(testContactData);
  
  if (notificationResult.success) {
    console.log("✅ Admin notification sent successfully!");
    console.log("   Email ID:", notificationResult.data?.id);
  } else {
    console.error("❌ Admin notification failed:");
    console.error("   Error:", notificationResult.error);
  }

  // Small delay to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test user confirmation
  console.log("\n📧 Sending user confirmation...");
  const confirmationResult = await sendContactConfirmation(testContactData);
  
  if (confirmationResult.success) {
    console.log("✅ User confirmation sent successfully!");
    console.log("   Email ID:", confirmationResult.data?.id);
  } else {
    console.error("❌ User confirmation failed:");
    console.error("   Error:", confirmationResult.error);
  }
}

async function testQuestionnaireEmail() {
  console.log("\n🧪 Testing Questionnaire Confirmation Email...\n");
  
  const testQuestionnaireData: QuestionnaireEmailData = {
    email: "drag.markovic@gmail.com", // Replace with your email
    submissionId: "test-" + Date.now(),
    submissionDate: new Date().toLocaleDateString("fr-BE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  console.log("📧 Sending questionnaire confirmation...");
  const result = await sendQuestionnaireConfirmation(testQuestionnaireData);
  
  if (result.success) {
    console.log("✅ Questionnaire confirmation sent successfully!");
    console.log("   Email ID:", result.data?.id);
  } else {
    console.error("❌ Questionnaire confirmation failed:");
    console.error("   Error:", result.error);
  }
}

async function checkEnvironmentVariables() {
  console.log("🔍 Checking Environment Configuration...\n");
  
  const requiredVars = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_TO: process.env.EMAIL_TO,
  };

  let allConfigured = true;
  
  for (const [key, value] of Object.entries(requiredVars)) {
    if (value) {
      console.log(`✅ ${key}: ${key === 'RESEND_API_KEY' ? '***' + value.slice(-4) : value}`);
    } else {
      console.log(`❌ ${key}: NOT SET`);
      allConfigured = false;
    }
  }

  if (!allConfigured) {
    console.log("\n⚠️  Warning: Some environment variables are missing.");
    console.log("   Make sure your .env.local file contains:");
    console.log("   - RESEND_API_KEY=your_api_key");
    console.log("   - EMAIL_FROM=contact@wuune.be (or verified domain)");
    console.log("   - EMAIL_TO=contact@wuune.be (admin email)");
    return false;
  }

  return true;
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Loyer.Brussels - Email Integration Test");
  console.log("═══════════════════════════════════════════════════\n");

  // Check configuration first
  const isConfigured = await checkEnvironmentVariables();
  
  if (!isConfigured) {
    console.log("\n❌ Cannot proceed with email tests - configuration incomplete.");
    process.exit(1);
  }

  console.log("\n" + "─".repeat(50) + "\n");

  try {
    // Test contact emails
    await testContactEmails();
    
    // Wait a bit to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test questionnaire email
    await testQuestionnaireEmail();
    
    console.log("\n" + "═".repeat(50));
    console.log("✅ Email test script completed!");
    console.log("📬 Check your inbox at drag.markovic@gmail.com");
    console.log("═".repeat(50) + "\n");
    
  } catch (error) {
    console.error("\n❌ Error running email tests:");
    console.error(error);
    process.exit(1);
  }
}

main();
