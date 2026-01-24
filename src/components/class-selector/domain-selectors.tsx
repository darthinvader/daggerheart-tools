import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ALL_DOMAIN_NAMES } from '@/lib/data/domains';
import { DomainIcons, HelpCircle, ICON_SIZE_MD } from '@/lib/icons';

interface DomainSelectorsProps {
  primaryDomain: string;
  secondaryDomain: string;
  onDomainChange: (index: 0 | 1, value: string) => void;
}

export function DomainSelectors({
  primaryDomain,
  secondaryDomain,
  onDomainChange,
}: DomainSelectorsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Primary Domain</Label>
        <Select value={primaryDomain} onValueChange={v => onDomainChange(0, v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {ALL_DOMAIN_NAMES.map(domain => {
              const DomainIcon = DomainIcons[domain] ?? HelpCircle;
              return (
                <SelectItem key={domain} value={domain}>
                  <span className="flex items-center gap-2">
                    <DomainIcon size={ICON_SIZE_MD} /> {domain}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Secondary Domain</Label>
        <Select
          value={secondaryDomain}
          onValueChange={v => onDomainChange(1, v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {ALL_DOMAIN_NAMES.map(domain => {
              const DomainIcon = DomainIcons[domain] ?? HelpCircle;
              return (
                <SelectItem key={domain} value={domain}>
                  <span className="flex items-center gap-2">
                    <DomainIcon size={ICON_SIZE_MD} /> {domain}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
