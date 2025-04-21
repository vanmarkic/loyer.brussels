import { FormProvider } from "../context/form-context"
import { RentalCalculator } from "../components/rental-calculator/calculator"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CalculatorPage() {
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
        <Link href="/" className="text-white flex items-center gap-2 uppercase font-medium">
          <ArrowLeft className="h-5 w-5" /> Retour
        </Link>
      </nav>

      {/* Main content */}
      <main className="flex-1 bg-gradient-to-b from-[#f18240] via-[#e05c6d] to-[#7b3f98] py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center text-white mb-8">
            <h1 className="text-3xl md:text-4xl font-bold uppercase">Calculateur de loyer indicatif</h1>
            <p className="mt-2 max-w-2xl mx-auto">
              Estimez le loyer de référence pour un bien à Bruxelles en fonction de ses caractéristiques
            </p>
          </div>

          <FormProvider>
            <RentalCalculator />
          </FormProvider>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#7b3f98] text-white py-4 px-6 text-center text-sm">
        <p>© 2023 Service Public Régional de Bruxelles - Bruxelles Logement. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
