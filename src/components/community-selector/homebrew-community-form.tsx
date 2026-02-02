/**
 * Homebrew Community Form - Character Page Wrapper
 *
 * Thin wrapper that uses the unified CommunityForm from the homebrew module.
 * Adapts between the character page's HomebrewCommunity type and CommunityForm's data type.
 */
import { useMemo } from 'react';

import { CommunityForm, type CommunityFormData } from '@/components/homebrew';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from '@/lib/icons';
import type { HomebrewCommunity } from '@/lib/schemas/identity';

interface HomebrewCommunityFormProps {
  homebrew: HomebrewCommunity | null;
  onChange: (homebrew: HomebrewCommunity) => void;
}

/** Convert HomebrewCommunity to CommunityFormData */
function homebrewToFormData(
  homebrew: HomebrewCommunity | null
): CommunityFormData | undefined {
  if (!homebrew) return undefined;
  return {
    name: homebrew.name,
    description: homebrew.description,
    commonTraits: homebrew.commonTraits,
    feature: {
      name: homebrew.feature.name,
      description: homebrew.feature.description,
      modifiers: homebrew.feature.modifiers,
    },
    isHomebrew: true,
  };
}

/** Convert CommunityFormData back to HomebrewCommunity */
function formDataToHomebrew(data: CommunityFormData): HomebrewCommunity {
  return {
    name: data.name,
    description: data.description,
    commonTraits: data.commonTraits,
    feature: {
      name: data.feature.name,
      description: data.feature.description,
      modifiers: data.feature.modifiers,
    },
  };
}

export function HomebrewCommunityForm({
  homebrew,
  onChange,
}: HomebrewCommunityFormProps) {
  const initialData = useMemo(() => homebrewToFormData(homebrew), [homebrew]);

  const handleChange = (data: CommunityFormData) => {
    onChange(formDataToHomebrew(data));
  };

  return (
    <Card className="border-primary/50 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge className="gap-1">
            <Wrench className="size-3" /> Homebrew
          </Badge>
          <CardTitle className="text-base">Create Community</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CommunityForm
          initialData={initialData}
          onChange={handleChange}
          showActions={false}
        />
      </CardContent>
    </Card>
  );
}
