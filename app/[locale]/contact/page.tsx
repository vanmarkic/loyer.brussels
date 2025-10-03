"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  ArrowLeft,
  Mail,
  Send,
  Users,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocale, useTranslations } from "next-intl";
import { useGlobalForm, GlobalFormProvider } from "@/features/calculator/context/global-form-context";
import { submitContactForm, ContactFormData } from "@/app/actions/send-contact";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

function ContactPageContent() {
  const currentLocale = useLocale();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const globalForm = useGlobalForm();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is coming from WUUNE join flow
  const isJoiningWuune = searchParams.get("join") === "true";
  const situation = searchParams.get("situation");

  // Get pre-filled data from global form
  const contactInfo = globalForm.getContactInfo();
  const userProfile = globalForm.state.userProfile;

  // Function to get default message based on situation
  function getDefaultMessageForSituation(situation: string | null): string {
    switch (situation) {
      case "abusive":
        return "Bonjour,\n\nJ'ai utilisé votre calculateur de loyer et il semblerait que mon loyer soit abusif. Je souhaite rejoindre le collectif Wuune pour obtenir de l'aide dans mes démarches.\n\nMerci de me recontacter.";
      case "high-but-legal":
        return "Bonjour,\n\nMon loyer est élevé mais reste dans les limites légales. Je souhaite rejoindre Wuune pour être accompagné(e) dans une éventuelle négociation avec mon propriétaire.\n\nMerci.";
      case "below-grid":
      case "fair":
        return "Bonjour,\n\nJe souhaite rejoindre le collectif Wuune pour défendre le droit au logement et soutenir d'autres locataires dans leurs démarches.\n\nMerci.";
      default:
        return "Bonjour,\n\nJe souhaite rejoindre le collectif Wuune.\n\nMerci.";
    }
  }

  const [formData, setFormData] = useState({
    name: "",
    email: contactInfo.email || "",
    subject: isJoiningWuune ? "Adhésion au collectif Wuune" : "",
    message: isJoiningWuune ? getDefaultMessageForSituation(situation) : "",
    newsletter: userProfile.joinNewsletter,
    assembly: userProfile.joinAssembly,
  });

  // Update form data when global form data changes
  useEffect(() => {
    if (contactInfo.email && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        email: contactInfo.email,
      }));
    }
  }, [contactInfo.email, formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const contactData: ContactFormData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        newsletter: formData.newsletter,
        assembly: formData.assembly,
      };

      const result = await submitContactForm(contactData);

      if (result.success) {
        toast({
          title: "Message envoyé !",
          description:
            "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
        });

        // Reset form
        setFormData({
          name: "",
          email: contactInfo.email || "",
          subject: "",
          message: "",
          newsletter: false,
          assembly: false,
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        {/* Skip to main content link for keyboard navigation */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-md focus:shadow-lg"
        >
          Aller au contenu principal
        </a>
        
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/${currentLocale}`}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                aria-label={t("ContactPage.header.backToHome")}
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                <span>{t("ContactPage.header.backToHome")}</span>
              </Link>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-600" aria-hidden="true" />
                <span className="font-bold text-xl">{t("ContactPage.header.title")}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <section className="bg-gradient-to-r from-red-600 to-red-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t("ContactPage.hero.title")}
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed">
                {t("ContactPage.hero.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact info */}
        <section id="main-content" className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center bg-white rounded-lg shadow-md p-8">
                <Mail className="h-12 w-12 text-red-600 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Email</h3>
                <p className="text-gray-600 mb-2">Écrivez-nous à :</p>
                <a
                  href="mailto:contact@wuune.be"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  contact@wuune.be
                </a>
              </div>

              <div className="text-center bg-white rounded-lg shadow-md p-8">
                <Users className="h-12 w-12 text-red-600 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Assemblées locales
                </h3>
                <p className="text-gray-600 mb-2">Participez à nos rencontres :</p>
                <p className="text-red-600 font-medium">
                  Tous les premiers mardis du mois
                </p>
                <p className="text-gray-600 text-sm">19h - Lieu variable</p>
              </div>

              <div className="text-center bg-white rounded-lg shadow-md p-8">
                <FileText className="h-12 w-12 text-red-600 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Newsletter</h3>
                <p className="text-gray-600 mb-2">Restez informé(e) :</p>
                <p className="text-red-600 font-medium">Inscrivez-vous ci-dessous</p>
                <p className="text-gray-600 text-sm">Actualités et événements</p>
              </div>
            </div>
          </div>
        </section>

        {/* Formulaire de contact */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {isJoiningWuune
                    ? "Finaliser votre adhésion"
                    : "Envoyez-nous un message"}
                </h2>
                <p className="text-gray-600">
                  {isJoiningWuune
                    ? "Complétez les informations ci-dessous pour rejoindre le collectif Wuune."
                    : "Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais."}
                </p>
                {isJoiningWuune && contactInfo.email && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" aria-hidden="true" />
                      <span className="text-sm font-medium">
                        Certaines informations ont été pré-remplies à partir de vos
                        réponses précédentes
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nom complet *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      aria-required="true"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Votre nom et prénom"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email *
                      </label>
                      {contactInfo.email && isJoiningWuune && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          ✓ Pré-rempli
                        </span>
                      )}
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      aria-required="true"
                      value={formData.email}
                      onChange={handleChange}
                      className={
                        contactInfo.email && isJoiningWuune
                          ? "bg-green-50 border-green-200"
                          : ""
                      }
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sujet *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    aria-required="true"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="L'objet de votre message"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    aria-required="true"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full"
                    placeholder="Décrivez votre situation, votre question ou votre demande..."
                  />
                </div>

                <div className="space-y-4">
                  <label
                    htmlFor="newsletter"
                    className="flex items-start gap-3 cursor-pointer p-3 -m-3 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("newsletter", checked as boolean)
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-gray-700">
                          Je souhaite m&apos;inscrire à la newsletter pour recevoir les
                          actualités du collectif
                        </span>
                        {isJoiningWuune && userProfile.joinNewsletter && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block w-fit">
                            ✓ Pré-rempli
                          </span>
                        )}
                      </div>
                    </div>
                  </label>

                  <label
                    htmlFor="assembly"
                    className="flex items-start gap-3 cursor-pointer p-3 -m-3 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id="assembly"
                      checked={formData.assembly}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("assembly", checked as boolean)
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-gray-700">
                          Je souhaite être invité(e) aux prochaines assemblées locales
                        </span>
                        {isJoiningWuune && userProfile.joinAssembly && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block w-fit">
                            ✓ Pré-rempli
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {t("ContactPage.form.privacyDisclaimer")}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white hover:bg-red-700 py-3 text-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" aria-hidden="true" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Informations supplémentaires */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                {t("ContactPage.additionalInfo.heading")}
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Pour les locataires
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Évaluation de votre loyer</li>
                    <li>• Accompagnement juridique</li>
                    <li>• Information sur vos droits</li>
                    <li>• Aide aux démarches administratives</li>
                    <li>• Médiation avec votre propriétaire</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Pour les sympathisants
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Adhésion au collectif</li>
                    <li>• Participation aux actions</li>
                    <li>• Bénévolat et engagement</li>
                    <li>• Diffusion de nos messages</li>
                    <li>• Soutien financier</li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Urgence locative ?
                </h3>
                <p className="text-gray-700">
                  Si vous êtes dans une situation d&apos;urgence (menace d&apos;expulsion,
                  loyer abusif, logement insalubre), n&apos;hésitez pas à nous contacter
                  rapidement. Nous ferons notre possible pour vous orienter vers les
                  bonnes personnes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Vous n&apos;êtes pas seul(e) !</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Le collectif Wuune est là pour vous accompagner et défendre vos droits.
              Ensemble, nous sommes plus forts face aux abus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${currentLocale}/wuune`}>
                <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Découvrir Wuune
                </Button>
              </Link>
              <Link href={`/${currentLocale}/calculateur`}>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-3 text-lg"
                >
                  Évaluer mon loyer
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Loading fallback component
function ContactPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}

// Export the wrapped component with GlobalFormProvider
export default function ContactPage() {
  return (
    <GlobalFormProvider>
      <Suspense fallback={<ContactPageLoading />}>
        <ContactPageContent />
      </Suspense>
    </GlobalFormProvider>
  );
}
