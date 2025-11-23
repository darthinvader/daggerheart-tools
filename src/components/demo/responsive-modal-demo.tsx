import * as React from 'react';

import { useDeviceType } from '@/components/device-type-context';
import { ResponsiveModal } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';

export function ResponsiveModalDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { deviceType } = useDeviceType();
  const [autoSave, setAutoSave] = React.useState(false);

  const handleSave = () => {
    // Perform save action
    alert('Saved!');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center gap-2">
        <div className="rounded border p-2">
          Current Device: <strong>{deviceType.toUpperCase()}</strong>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoSave}
            onChange={e => setAutoSave(e.target.checked)}
          />
          Auto Save on Close
        </label>
      </div>

      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <ResponsiveModal
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        autoSaveOnClose={autoSave}
        title="Responsive Modal"
        description={`This modal adjusts its width based on the device type (${deviceType}).`}
        mode={deviceType}
      >
        <div className="space-y-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>Scrollable content line {i + 1}</p>
          ))}
          <p>End of content.</p>
        </div>
      </ResponsiveModal>
    </div>
  );
}
