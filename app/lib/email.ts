import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletter: boolean;
  assembly: boolean;
}

export interface QuestionnaireEmailData {
  email: string;
  submissionId: string;
  submissionDate: string;
}

/**
 * Send contact form submission notification to admin
 */
export async function sendContactNotification(data: ContactEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "contact@wuune.be",
      to: process.env.EMAIL_TO || "contact@wuune.be",
      subject: `[Loyer.Brussels] ${data.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #4b5563; display: block; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-radius: 3px; border: 1px solid #d1d5db; }
              .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 5px 5px; }
              .preferences { background: #fef3c7; padding: 15px; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Nouvelle soumission de formulaire de contact</h1>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">Nom:</span>
                  <div class="value">${data.name}</div>
                </div>
                <div class="field">
                  <span class="label">Email:</span>
                  <div class="value"><a href="mailto:${data.email}">${
        data.email
      }</a></div>
                </div>
                <div class="field">
                  <span class="label">Sujet:</span>
                  <div class="value">${data.subject}</div>
                </div>
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="value">${data.message.replace(/\n/g, "<br>")}</div>
                </div>
                ${
                  data.newsletter || data.assembly
                    ? `
                <div class="preferences">
                  <strong>Préférences:</strong>
                  <ul style="margin: 10px 0;">
                    ${data.newsletter ? "<li>✓ Souhaite recevoir la newsletter</li>" : ""}
                    ${
                      data.assembly
                        ? "<li>✓ Souhaite être invité(e) aux assemblées</li>"
                        : ""
                    }
                  </ul>
                </div>
                `
                    : ""
                }
              </div>
              <div class="footer">
                Ce message a été envoyé depuis le formulaire de contact de loyer.brussels
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending contact notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error("Error sending contact notification:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send confirmation email to user who submitted contact form
 */
export async function sendContactConfirmation(data: ContactEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "contact@wuune.be",
      to: data.email,
      subject: "Votre message a bien été reçu - Loyer.Brussels",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 5px 5px; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Merci de nous avoir contactés!</h1>
              </div>
              <div class="content">
                <p>Bonjour ${data.name},</p>
                <p>Nous avons bien reçu votre message concernant "${data.subject}".</p>
                <p>Notre équipe examine votre demande et vous répondra dans les plus brefs délais, généralement sous 48 heures.</p>
                ${
                  data.newsletter || data.assembly
                    ? `
                <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 5px;">
                  <strong>Vos préférences ont été enregistrées:</strong><br>
                  ${data.newsletter ? "✓ Vous recevrez notre newsletter<br>" : ""}
                  ${
                    data.assembly
                      ? "✓ Vous serez invité(e) aux prochaines assemblées locales"
                      : ""
                  }
                </p>
                `
                    : ""
                }
                <p>En attendant, n'hésitez pas à consulter nos ressources en ligne.</p>
                <div style="text-align: center;">
                  <a href="https://loyer.brussels" class="button">Visiter notre site</a>
                </div>
              </div>
              <div class="footer">
                <p style="margin: 0;">Collectif Wuune - Défense du droit au logement</p>
                <p style="margin: 5px 0 0 0;">contact@wuune.be</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending contact confirmation:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error("Error sending contact confirmation:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send questionnaire submission confirmation to user
 */
export async function sendQuestionnaireConfirmation(data: QuestionnaireEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "contact@wuune.be",
      to: data.email,
      subject: "Votre questionnaire a été soumis - Loyer.Brussels",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 5px 5px; }
              .info-box { background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Questionnaire soumis avec succès</h1>
              </div>
              <div class="content">
                <p>Merci d'avoir complété notre questionnaire détaillé!</p>
                <div class="info-box">
                  <strong>Informations de soumission:</strong><br>
                  ID: ${data.submissionId}<br>
                  Date: ${data.submissionDate}
                </div>
                <p>Vos réponses ont été enregistrées et notre équipe va les examiner attentivement pour mieux comprendre votre situation.</p>
                <p><strong>Prochaines étapes:</strong></p>
                <ul>
                  <li>Notre équipe va analyser votre cas dans les 3-5 jours ouvrables</li>
                  <li>Nous vous contacterons par email ou téléphone si nous avons besoin de précisions</li>
                  <li>Nous vous proposerons un accompagnement personnalisé en fonction de votre situation</li>
                </ul>
                <p>Si votre situation est urgente (menace d'expulsion, logement insalubre), n'hésitez pas à nous contacter directement à <a href="mailto:contact@wuune.be">contact@wuune.be</a>.</p>
              </div>
              <div class="footer">
                <p style="margin: 0;">Collectif Wuune - Ensemble pour un logement décent</p>
                <p style="margin: 5px 0 0 0;">contact@wuune.be</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending questionnaire confirmation:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error("Error sending questionnaire confirmation:", error);
    return { success: false, error: String(error) };
  }
}
