"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  Users,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocale, useTranslations } from "next-intl";

export default function ContactPage() {
  const currentLocale = useLocale();
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    newsletter: false,
    assembly: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi du formulaire
    console.log("Formulaire soumis:", formData);
    alert(
      "Votre message a été envoyé ! Nous vous répondrons dans les plus brefs délais."
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/${currentLocale}`}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{t("ContactPage.header.backToHome")}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-600" />
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center bg-white rounded-lg shadow-md p-8">
              <Mail className="h-12 w-12 text-red-600 mx-auto mb-4" />
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
              <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Assemblées locales
              </h3>
              <p className="text-gray-600 mb-2">Participez à nos rencontres :</p>
              <p className="text-red-600 font-medium">Tous les premiers mardis du mois</p>
              <p className="text-gray-600 text-sm">19h - Lieu variable</p>
            </div>

            <div className="text-center bg-white rounded-lg shadow-md p-8">
              <FileText className="h-12 w-12 text-red-600 mx-auto mb-4" />
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
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus
                brefs délais.
              </p>
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
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Votre nom et prénom"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
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
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full"
                  placeholder="Décrivez votre situation, votre question ou votre demande..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("newsletter", checked as boolean)
                    }
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-700">
                    Je souhaite m'inscrire à la newsletter pour recevoir les actualités du
                    collectif
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assembly"
                    checked={formData.assembly}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("assembly", checked as boolean)
                    }
                  />
                  <label htmlFor="assembly" className="text-sm text-gray-700">
                    Je souhaite être invité(e) aux prochaines assemblées locales
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  {t("ContactPage.form.privacyDisclaimer")}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 text-white hover:bg-red-700 py-3 text-lg flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                Envoyer le message
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
                Si vous êtes dans une situation d'urgence (menace d'expulsion, loyer
                abusif, logement insalubre), n'hésitez pas à nous contacter rapidement.
                Nous ferons notre possible pour vous orienter vers les bonnes personnes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Vous n'êtes pas seul(e) !</h2>
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
  );
}
