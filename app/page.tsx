import Image from "next/image"
import Link from "next/link"
import { Facebook, Menu, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top header */}
      <header className="bg-white py-2 px-4 flex items-center border-b">
        <div className="flex items-center gap-2">
          <Image src="/logo-small.svg" alt="Bruxelles Logement Logo" width={24} height={24} className="h-6 w-auto" />
          <span className="text-xs font-medium uppercase">
            SERVICE PUBLIC RÉGIONAL DE BRUXELLES - BRUXELLES LOGEMENT
          </span>
        </div>
      </header>

      {/* Main navigation */}
      <nav className="bg-[#f18240] py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Bruxelles Logement Logo" width={40} height={40} className="h-10 w-auto" />
          <div className="text-white uppercase">
            <div className="font-bold text-lg leading-tight">BRUXELLES LOGEMENT</div>
            <div className="text-xs leading-tight">SERVICE PUBLIC RÉGIONAL DE BRUXELLES</div>
          </div>
        </div>
        <button className="text-white flex items-center gap-2 uppercase font-medium">
          MENU <Menu className="h-5 w-5" />
        </button>
      </nav>

      {/* Hero section with gradient background */}
      <main className="flex-1 bg-gradient-to-b from-[#f18240] via-[#e05c6d] to-[#7b3f98]">
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left content */}
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight">
                À COMBIEN SE LOUE UN LOGEMENT À BRUXELLES?
              </h1>

              <div className="space-y-4">
                <h2 className="text-2xl font-medium">Faites le test !</h2>
                <p className="text-sm md:text-base">
                  Que vous soyez locataire ou bailleur, actuel ou futur, ce site vous permettra de connaître le loyer
                  indicatif de référence pour le bien que vous louez ou envisagez de louer en prenant en compte sa
                  localisation et ses caractéristiques principales.
                </p>
              </div>

              <div className="bg-white text-gray-700 p-4 rounded-md text-sm">
                <p>
                  Le site de la grille des loyers a été adapté afin de rendre plus transparent le calcul du loyer de
                  référence.
                </p>
                <Button variant="default" className="mt-4 bg-[#e05c6d] hover:bg-[#d04c5d]">
                  En savoir plus
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button className="bg-[#e05c6d] hover:bg-[#d04c5d] rounded-full px-8">Démarrer</Button>

                <div className="flex items-center gap-3">
                  <span className="text-sm uppercase">Partagez le site</span>
                  <Link href="#" className="bg-[#3b5998] p-1.5 rounded-full">
                    <Facebook className="h-4 w-4 text-white" />
                  </Link>
                  <Link href="#" className="bg-[#1da1f2] p-1.5 rounded-full">
                    <Twitter className="h-4 w-4 text-white" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right content - circular image */}
            <div className="hidden md:block relative">
              <div className="aspect-square rounded-full overflow-hidden border-4 border-white">
                <Image
                  src="https://sjc.microlink.io/yBTCLvc2RkrWd6AiK70fNOyQ_Ckfrp1xQ3oGVSBFHi-lRtNR5fRpEh1zKNa7pik0NWCO21KSpnzVsLYZYZht8w.jpeg"
                  alt="Brussels cityscape"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom sections */}
      <section className="bg-[#7b3f98] py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#d04c5d] text-white p-6 rounded-t-lg relative">
              <h3 className="text-xl font-bold uppercase">À PROPOS DES LOYERS DE RÉFÉRENCE</h3>
              <div className="absolute -bottom-6 right-6 w-12 h-12 bg-white rounded-full"></div>
            </div>

            <div className="bg-[#1a237e] text-white p-6 rounded-t-lg relative">
              <h3 className="text-xl font-bold uppercase">BASE LÉGALE</h3>
              <div className="absolute -bottom-6 right-6 w-12 h-12 bg-white rounded-full"></div>
            </div>

            <div className="bg-[#d04c5d] text-white p-6 rounded-t-lg relative">
              <h3 className="text-xl font-bold uppercase">QUESTIONS RÉPONSES</h3>
              <div className="absolute -bottom-6 right-6 w-12 h-12 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
