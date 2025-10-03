'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Trash2, Play } from 'lucide-react';
import { useGlobalForm } from '@/features/calculator/context/global-form-context';

interface SessionRestorationProps {
  onSessionRestored?: (wasRestored: boolean) => void;
}

export function SessionRestoration({ onSessionRestored }: SessionRestorationProps) {
  const { state, loadSession, clearSession } = useGlobalForm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savedSession, setSavedSession] = useState<any>(null);

  useEffect(() => {
    // Check for existing session on mount
    const checkForSavedSession = () => {
      if (typeof window !== 'undefined') {
        try {
          const saved = sessionStorage.getItem('loyer-brussels-form-data');
          if (saved) {
            const parsedSession = JSON.parse(saved);
            const sessionAge = Date.now() - parsedSession.lastUpdated;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            // Only show dialog if session exists and is recent
            if (sessionAge < maxAge && parsedSession.currentStep > 1) {
              setSavedSession(parsedSession);
              setIsDialogOpen(true);
            }
          }
        } catch (error) {
          console.warn('Error checking for saved session:', error);
        }
      }
    };

    checkForSavedSession();
  }, []);

  const handleRestoreSession = () => {
    loadSession();
    setIsDialogOpen(false);
    onSessionRestored?.(true);
  };

  const handleStartFresh = () => {
    clearSession();
    setIsDialogOpen(false);
    onSessionRestored?.(false);
  };

  if (!savedSession) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('fr-BE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStepName = (step: number) => {
    const stepNames = [
      '',
      'Type de propriété',
      'Détails du bien',
      'Caractéristiques',
      'Performance énergétique',
      'Adresse',
      'Résultats',
    ];
    return stepNames[step] || `Étape ${step}`;
  };

  const progressPercentage = Math.round((savedSession.currentStep / 6) * 100);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session précédente trouvée</DialogTitle>
          <DialogDescription>
            Nous avons trouvé une session précédente de votre évaluation. Souhaitez-vous
            la reprendre où vous vous êtes arrêté ?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>Dernière sauvegarde:</strong>{' '}
                  {formatDate(savedSession.lastUpdated)}
                </p>
                <p>
                  <strong>Progression:</strong> {getStepName(savedSession.currentStep)}(
                  {progressPercentage}% complété)
                </p>
                {savedSession.propertyInfo.propertyType && (
                  <p>
                    <strong>Type:</strong> {savedSession.propertyInfo.propertyType}
                  </p>
                )}
                {savedSession.propertyInfo.size > 0 && (
                  <p>
                    <strong>Surface:</strong> {savedSession.propertyInfo.size}m²
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleRestoreSession}
              className="flex items-center gap-2 touch-manipulation"
            >
              <Play className="h-4 w-4" />
              Reprendre ma session
            </Button>

            <Button
              onClick={handleStartFresh}
              variant="outline"
              className="flex items-center gap-2 touch-manipulation"
            >
              <Trash2 className="h-4 w-4" />
              Recommencer à zéro
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Les sessions sont automatiquement supprimées après 24 heures.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
