"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Download, Share2 } from "lucide-react"

export function ResultStep() {
  const { state, dispatch } = useForm()

  const handleReset = () => {
    dispatch({ type: "RESET_FORM" })
  }

  const propertyTypeLabels: Record<string, string> = {
    apartment: "Appartement",
    house: "Maison",
    studio: "Studio",
    other: "Autre",
  }

  const neighborhoodLabels: Record<string, string> = {
    center: "Centre-ville",
    north: "Nord",
    south: "Sud",
    east: "Est",
    west: "Ouest",
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Résultat de l'estimation</h2>
        <p className="text-muted-foreground mt-2">Voici le loyer indicatif pour ce bien</p>
      </div>

      <Card className="bg-gradient-to-r from-[#f18240] to-[#e05c6d] text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg font-medium">Loyer mensuel estimé</p>
            <p className="text-5xl font-bold mt-2">{state.estimatedRent} €</p>
            <p className="text-sm mt-2 opacity-80">Ce montant est indicatif et peut varier selon d'autres facteurs</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">Récapitulatif du bien</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Type de bien:</div>
          <div className="font-medium">{propertyTypeLabels[state.propertyType] || "-"}</div>

          <div className="text-muted-foreground">Surface:</div>
          <div className="font-medium">{state.size} m²</div>

          <div className="text-muted-foreground">Chambres:</div>
          <div className="font-medium">{state.bedrooms}</div>

          <div className="text-muted-foreground">Salles de bain:</div>
          <div className="font-medium">{state.bathrooms}</div>

          <div className="text-muted-foreground">Localisation:</div>
          <div className="font-medium">{neighborhoodLabels[state.neighborhood] || "-"}</div>

          <div className="text-muted-foreground">Étage:</div>
          <div className="font-medium">{state.floor}</div>

          <div className="text-muted-foreground">Classe énergétique:</div>
          <div className="font-medium">{state.energyClass}</div>

          <div className="text-muted-foreground">Équipements:</div>
          <div className="font-medium">
            {[
              state.hasElevator ? "Ascenseur" : null,
              state.hasParking ? "Parking" : null,
              state.hasBalcony ? "Balcon" : null,
              state.hasGarden ? "Jardin" : null,
              state.isRenovated ? "Rénové" : null,
            ]
              .filter(Boolean)
              .join(", ") || "Aucun"}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <Download className="h-4 w-4" /> Télécharger PDF
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Share2 className="h-4 w-4" /> Partager
          </Button>
        </div>
        <Button onClick={handleReset} className="bg-[#e05c6d] hover:bg-[#d04c5d] gap-2">
          Nouvelle estimation <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
