"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Users, ArrowLeft, Target, Shield, Handshake } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useLocale } from "next-intl";

export default function WuunePage() {
  const currentLocale = useLocale();

  return (
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
              aria-label="Retour à la page d'accueil"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span>Retour à l&apos;accueil</span>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-600" aria-hidden="true" />
              <span className="font-bold text-xl">WUUNE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-r from-red-600 to-red-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Qui sommes-nous ?</h1>
            <p className="text-xl md:text-2xl leading-relaxed">
              Wuune est un collectif citoyen qui lutte pour des loyers équitables et
              contre les abus dans le secteur du logement.
            </p>
          </div>
        </div>
      </section>

      {/* Notre mission */}
      <section id="main-content" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Notre mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Le collectif Wuune est né de la nécessité de défendre les droits des
                locataires face à la hausse constante des loyers et aux pratiques abusives
                de certains propriétaires.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nous croyons fermement que le logement est un droit fondamental et que
                chacun mérite un toit décent à un prix équitable. Notre action s&apos;inscrit
                dans une démarche solidaire et collective.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Target className="h-8 w-8 text-red-600 mx-auto mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-gray-800">Objectifs clairs</h3>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-gray-800">Protection légale</h3>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Handshake className="h-8 w-8 text-red-600 mx-auto mb-2" aria-hidden="true" />
                  <h3 className="font-semibold text-gray-800">Solidarité</h3>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/placeholder.jpg"
                  alt="Manifestation du collectif Wuune"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-medium">Manifestation pour des loyers équitables</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nos valeurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Solidarité</h3>
              <p className="text-gray-600">
                Nous croyons en la force du collectif. Ensemble, nous sommes plus forts
                pour défendre nos droits et faire entendre notre voix.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Justice sociale</h3>
              <p className="text-gray-600">
                Le logement est un droit fondamental. Nous luttons pour que ce droit soit
                respecté et accessible à tous.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Bienveillance</h3>
              <p className="text-gray-600">
                Nous accompagnons chaque personne dans ses démarches avec empathie et
                respect, sans jugement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment nous agissons */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Comment nous agissons
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Information et sensibilisation
                </h3>
                <p className="text-gray-600">
                  Nous informons les locataires de leurs droits et sensibilisons l&apos;opinion
                  publique aux problématiques du logement à travers des campagnes de
                  communication et des événements.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Accompagnement juridique
                </h3>
                <p className="text-gray-600">
                  Nous orientons et accompagnons les locataires dans leurs démarches
                  légales, en collaboration avec des professionnels du droit spécialisés.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Actions collectives
                </h3>
                <p className="text-gray-600">
                  Nous organisons des manifestations, des rassemblements et des actions de
                  protestation pacifiques pour faire pression sur les autorités
                  compétentes.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Plaidoyer politique
                </h3>
                <p className="text-gray-600">
                  Nous portons nos revendications auprès des élus et participons aux
                  débats publics pour influencer les politiques de logement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Rejoignez notre combat !</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Votre voix compte. Ensemble, nous pouvons faire changer les choses et
            construire un avenir où le logement sera accessible à tous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${currentLocale}/campagne`}>
              <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Rejoindre la campagne
              </Button>
            </Link>
            <Link href={`/${currentLocale}/contact`}>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-3 text-lg"
              >
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
