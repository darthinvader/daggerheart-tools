import { useState } from 'react';

import { ThresholdsEditor } from '@/components/thresholds-editor';

export function ThresholdsEditorDemo() {
  const [minor, setMinor] = useState(2);
  const [severe, setSevere] = useState(5);
  const [major, setMajor] = useState(10);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [autoCalculateMajor, setAutoCalculateMajor] = useState(true);
  const [showMajor, setShowMajor] = useState(false);

  const [customMinor, setCustomMinor] = useState(3);
  const [customSevere, setCustomSevere] = useState(7);
  const [customMajor, setCustomMajor] = useState(14);
  const [customAutoMajor, setCustomAutoMajor] = useState(false);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Interactive Editor</h2>
        <div className="bg-card rounded-lg border p-6">
          <ThresholdsEditor
            minor={minor}
            severe={severe}
            major={major}
            autoCalculate={autoCalculate}
            autoCalculateMajor={autoCalculateMajor}
            showMajor={showMajor}
            baseHp={12}
            onMinorChange={setMinor}
            onSevereChange={setSevere}
            onMajorChange={setMajor}
            onAutoCalculateChange={setAutoCalculate}
            onAutoCalculateMajorChange={setAutoCalculateMajor}
            onShowMajorChange={setShowMajor}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Manual Entry Mode</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          All thresholds set manually with custom Major value
        </p>
        <div className="bg-card rounded-lg border p-6">
          <ThresholdsEditor
            minor={customMinor}
            severe={customSevere}
            major={customMajor}
            autoCalculate={false}
            autoCalculateMajor={customAutoMajor}
            showMajor={true}
            onMinorChange={setCustomMinor}
            onSevereChange={setCustomSevere}
            onMajorChange={setCustomMajor}
            onAutoCalculateChange={() => {}}
            onAutoCalculateMajorChange={setCustomAutoMajor}
            onShowMajorChange={() => {}}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Display Only (No Major)</h2>
        <div className="bg-card rounded-lg border p-6">
          <ThresholdsEditor
            minor={2}
            severe={5}
            autoCalculate={true}
            showMajor={false}
            baseHp={12}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">High HP Character</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Base HP: 24 — Thresholds scale automatically
        </p>
        <div className="bg-card rounded-lg border p-6">
          <ThresholdsEditor
            minor={4}
            severe={8}
            major={16}
            autoCalculate={true}
            showMajor={true}
            baseHp={24}
          />
        </div>
      </section>
    </div>
  );
}
