import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

export const resend = new Resend(resendApiKey);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'Loyer Brussels <noreply@loyer.brussels>',
  replyTo,
}: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending exception:', error);
    throw error;
  }
}
