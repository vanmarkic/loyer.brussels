'use server';

import { createAdminClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import type { ContactFormData } from '@/types/calculator';

export async function submitContact(formData: ContactFormData, calculationId?: string) {
  try {
    const supabase = createAdminClient();

    // Save to database
    const data = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      wants_membership: formData.wantsMembership,
      wants_newsletter: formData.wantsNewsletter,
      wants_assembly_invites: formData.wantsAssemblyInvites,
      calculation_id: calculationId || null,
      source: 'contact-form',
      status: 'new',
    };

    const { data: inserted, error: dbError } = await supabase
      .from('contacts')
      .insert([data])
      .select()
      .single();

    if (dbError) {
      console.error('Error saving contact:', dbError);
      throw new Error('Failed to save contact');
    }

    // Send confirmation email to user
    try {
      await sendEmail({
        to: formData.email,
        subject: 'Thank you for contacting WUUNE - Loyer Brussels',
        html: `
          <h1>Thank you for contacting WUUNE!</h1>
          <p>Dear ${formData.firstName} ${formData.lastName},</p>
          <p>We have received your message and will get back to you within 48 hours.</p>

          ${
            formData.wantsMembership
              ? '<p><strong>Membership:</strong> We will send you information about joining WUUNE.</p>'
              : ''
          }
          ${
            formData.wantsNewsletter
              ? '<p><strong>Newsletter:</strong> You have been added to our mailing list.</p>'
              : ''
          }
          ${
            formData.wantsAssemblyInvites
              ? '<p><strong>Assemblies:</strong> You will receive invitations to our monthly meetings.</p>'
              : ''
          }

          <p><strong>What happens next?</strong></p>
          <ul>
            <li>A WUUNE volunteer will review your message</li>
            <li>You'll receive a personal response within 48 hours</li>
            <li>We'll provide guidance specific to your situation</li>
          </ul>

          <p>In the meantime, feel free to explore our resources at <a href="https://loyer.brussels">loyer.brussels</a></p>

          <p>Best regards,<br>
          The WUUNE Team<br>
          Brussels Tenants Collective</p>

          <hr>
          <p style="font-size: 12px; color: #666;">
          Contact: contact@wuune.be<br>
          This is an automated confirmation email.
          </p>
        `,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the whole operation if email fails
    }

    // Send notification email to WUUNE
    try {
      await sendEmail({
        to: 'contact@wuune.be',
        subject: `New Contact Form Submission - ${formData.firstName} ${formData.lastName}`,
        html: `
          <h2>New Contact Form Submission</h2>

          <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>

          <p><strong>Message:</strong></p>
          <p>${formData.message || 'No message'}</p>

          <hr>

          <p><strong>Interests:</strong></p>
          <ul>
            <li>Wants Membership: ${formData.wantsMembership ? 'Yes' : 'No'}</li>
            <li>Wants Newsletter: ${formData.wantsNewsletter ? 'Yes' : 'No'}</li>
            <li>Wants Assembly Invites: ${formData.wantsAssemblyInvites ? 'Yes' : 'No'}</li>
          </ul>

          ${calculationId ? `<p><strong>Associated Calculation ID:</strong> ${calculationId}</p>` : ''}

          <p><strong>Contact ID:</strong> ${inserted.id}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `,
      });
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
    }

    return { success: true, id: inserted.id };
  } catch (error) {
    console.error('Error in submitContact:', error);
    return { success: false, error: 'Failed to submit contact form' };
  }
}
