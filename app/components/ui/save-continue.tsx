'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGlobalForm } from '@/app/context/global-form-context';

interface SaveContinueProps {
  onContinue?: () => void;
  continueText?: string;
  isLastStep?: boolean;
  disabled?: boolean;
  autoSaveInterval?: number; // in seconds
}

export function SaveContinue({
  onContinue,
  continueText = 'Continuer',
  isLastStep = false,
  disabled = false,
  autoSaveInterval = 30,
}: SaveContinueProps) {
  const { state, saveSession } = useGlobalForm();
  const [email, setEmail] = useState(state.userProfile.email);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      saveSession();
      setLastAutoSave(new Date());
    }, autoSaveInterval * 1000);

    return () => clearInterval(interval);
  }, [autoSaveInterval, saveSession]);

  const generateSaveLink = () => {
    const baseUrl = window.location.origin;
    const calculatorPath = `/${window.location.pathname.split('/')[1]}/calculateur`;
    return `${baseUrl}${calculatorPath}?session=${state.sessionId}`;
  };

  const handleSaveForLater = () => {
    // Save current progress
    saveSession();

    // If email provided, we could send them the link (future feature)
    if (email) {
      // TODO: Implement email sending functionality
      console.log('Would send save link to:', email);
    }

    setSaveSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
      setIsDialogOpen(false);
    }, 3000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="space-y-4">
      {/* Auto-save indicator */}
      {lastAutoSave && (
        <div className="text-xs text-gray-500 text-center">
          Sauvegarde automatique: {lastAutoSave.toLocaleTimeString()}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        {/* Save for Later */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 touch-manipulation text-sm sm:text-base px-3 py-2 h-10 sm:h-auto whitespace-nowrap"
              type="button"
            >
              <Save className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Sauvegarder pour plus tard</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sauvegarder votre progression</DialogTitle>
              <DialogDescription>
                Nous sauvegarderons automatiquement vos réponses. Vous pouvez reprendre où
                vous vous êtes arrêté en revenant sur cette page.
              </DialogDescription>
            </DialogHeader>

            {!saveSuccess ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email (optionnel) - pour recevoir un lien de reprise
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-base" // Prevents iOS zoom
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lien de reprise (copiez et sauvegardez)</Label>
                  <div className="flex gap-2">
                    <Input value={generateSaveLink()} readOnly className="text-sm" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateSaveLink())}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSaveForLater}
                  className="w-full touch-manipulation"
                >
                  Sauvegarder maintenant
                </Button>
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  ✅ Progression sauvegardée avec succès! Vous pouvez fermer cette fenêtre
                  et revenir plus tard en utilisant le lien copié.
                </AlertDescription>
              </Alert>
            )}
          </DialogContent>
        </Dialog>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          disabled={disabled}
          className={`flex items-center gap-2 touch-manipulation text-sm sm:text-base px-4 py-2 h-10 sm:h-auto whitespace-nowrap ${
            isLastStep ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          <span className="truncate">{continueText}</span>
          <ArrowRight className="h-4 w-4 flex-shrink-0" />
        </Button>
      </div>
    </div>
  );
}
