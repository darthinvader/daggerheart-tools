import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { LoadoutSelection } from '@/lib/schemas/loadout';

interface ReviewStepProps {
  classSelection: ClassSelection;
  loadout: LoadoutSelection;
  onCreateCharacter: () => void;
}

export function ReviewStep({
  classSelection,
  loadout,
  onCreateCharacter,
}: ReviewStepProps) {
  const classDomains = classSelection.domains;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⚔️</span>
              <span>Class & Subclass</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Class:</strong>{' '}
                {classSelection.isHomebrew
                  ? `${classSelection.className} (Homebrew)`
                  : classSelection.className}
              </p>
              <p>
                <strong>Subclass:</strong> {classSelection.subclassName}
              </p>
              <p>
                <strong>Domains:</strong> {classDomains.join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📜</span>
              <span>Domain Loadout</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Active Cards:</strong>{' '}
                {loadout.activeCards.length > 0
                  ? loadout.activeCards.map(c => c.name).join(', ')
                  : 'None selected'}
              </p>
              <p>
                <strong>Vault Cards:</strong>{' '}
                {loadout.vaultCards.length > 0
                  ? loadout.vaultCards.map(c => c.name).join(', ')
                  : 'None selected'}
              </p>
              {loadout.homebrewCards.length > 0 && (
                <p>
                  <strong>Homebrew Cards:</strong>{' '}
                  {loadout.homebrewCards.map(c => c.name).join(', ')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>✨</span>
            <span>Ready to Create!</span>
          </CardTitle>
          <CardDescription>
            Your character selections are complete. Click below to create your
            character and start your adventure!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onCreateCharacter} size="lg" className="w-full">
            🎉 Create Character
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
