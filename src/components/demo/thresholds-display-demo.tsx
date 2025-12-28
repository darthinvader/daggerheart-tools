import { useState } from 'react';

import {
  ThresholdsDisplay,
  ThresholdsEditableSection,
} from '@/components/thresholds-editor';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ThresholdsSettings } from '@/lib/schemas/character-state';

const SAMPLE_AUTO: ThresholdsSettings = {
  auto: true,
  values: {
    major: 3,
    severe: 6,
    dsOverride: false,
    ds: 0,
  },
  enableCritical: false,
};

const SAMPLE_MANUAL: ThresholdsSettings = {
  auto: false,
  values: {
    major: 5,
    severe: 10,
    dsOverride: false,
    ds: 0,
  },
  enableCritical: false,
};

const SAMPLE_WITH_MAJOR: ThresholdsSettings = {
  auto: false,
  values: {
    major: 4,
    severe: 8,
    dsOverride: false,
    ds: 16,
  },
  enableCritical: true,
};

export function ThresholdsDisplayDemo() {
  const [autoSettings, setAutoSettings] =
    useState<ThresholdsSettings>(SAMPLE_AUTO);
  const [manualSettings, setManualSettings] =
    useState<ThresholdsSettings>(SAMPLE_MANUAL);
  const [majorSettings, setMajorSettings] =
    useState<ThresholdsSettings>(SAMPLE_WITH_MAJOR);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">💔 Thresholds Display Demo</h2>
        <p className="text-muted-foreground">
          Showcases the ThresholdsEditableSection component with edit modal
          capability. Click the Edit button to configure damage thresholds.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-green-500/30 bg-green-500/10 text-green-600"
              >
                🤖 Auto-Calculated
              </Badge>
              <span className="text-muted-foreground font-normal">
                Based on HP
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ThresholdsEditableSection
              settings={autoSettings}
              onChange={setAutoSettings}
              baseHp={6}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-amber-500/30 bg-amber-500/10 text-amber-600"
              >
                ✏️ Manual
              </Badge>
              <span className="text-muted-foreground font-normal">
                Custom values
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ThresholdsEditableSection
              settings={manualSettings}
              onChange={setManualSettings}
              baseHp={8}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-red-500/30 bg-red-500/10 text-red-600"
              >
                💀 With Major Threshold
              </Badge>
              <span className="text-muted-foreground font-normal">
                For high-level play
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ThresholdsEditableSection
              settings={majorSettings}
              onChange={setMajorSettings}
              baseHp={10}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">📊 Display-Only Variants</h3>
        <p className="text-muted-foreground text-sm">
          The ThresholdsDisplay component without editing capability (for
          read-only views).
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Standard</CardTitle>
            </CardHeader>
            <CardContent>
              <ThresholdsDisplay minor={3} severe={6} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Higher Thresholds</CardTitle>
            </CardHeader>
            <CardContent>
              <ThresholdsDisplay minor={5} severe={10} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">With Major</CardTitle>
            </CardHeader>
            <CardContent>
              <ThresholdsDisplay minor={4} severe={8} major={16} showMajor />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
