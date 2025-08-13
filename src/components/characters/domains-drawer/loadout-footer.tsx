import { Button } from '@/components/ui/button';

export type LoadoutFooterProps = {
  recallBudgetUsed: number;
  canSave: boolean;
  onReset: () => void;
  onSaveClick: () => void;
  formId?: string;
};

export function LoadoutFooter({
  recallBudgetUsed,
  canSave,
  onReset,
  onSaveClick,
  formId,
}: LoadoutFooterProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="text-muted-foreground text-xs">
        Recall used: <span className="font-medium">{recallBudgetUsed}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" onClick={onReset}>
          Reset
        </Button>
        <Button
          type="submit"
          form={formId}
          onClick={onSaveClick}
          disabled={!canSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
