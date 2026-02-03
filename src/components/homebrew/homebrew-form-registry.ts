// Form registry for homebrew content types

import type { ComponentType } from 'react';

import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';

import { AdversaryForm } from './adversary-form';
import { AncestryForm } from './ancestry-form';
import { ClassForm } from './class-form';
import { CommunityForm } from './community-form';
import { DomainCardForm } from './domain-card-form';
import { EnvironmentForm } from './environment-form';
import { EquipmentForm } from './equipment-form';
import { ItemForm } from './item-form';
import { SubclassForm } from './subclass-form';

interface FormProps<T = unknown> {
  initialData?: T;
  onSubmit: (content: HomebrewContent['content']) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

// Form registry mapping content types to their form components
export const HOMEBREW_FORM_REGISTRY: Record<
  HomebrewContentType,
  ComponentType<FormProps<unknown>> | null
> = {
  adversary: AdversaryForm as ComponentType<FormProps<unknown>>,
  environment: EnvironmentForm as ComponentType<FormProps<unknown>>,
  domain_card: DomainCardForm as ComponentType<FormProps<unknown>>,
  class: ClassForm as ComponentType<FormProps<unknown>>,
  subclass: SubclassForm as ComponentType<FormProps<unknown>>,
  ancestry: AncestryForm as ComponentType<FormProps<unknown>>,
  community: CommunityForm as ComponentType<FormProps<unknown>>,
  equipment: EquipmentForm as ComponentType<FormProps<unknown>>,
  item: ItemForm as ComponentType<FormProps<unknown>>,
};

export function getHomebrewForm(contentType: HomebrewContentType) {
  return HOMEBREW_FORM_REGISTRY[contentType] ?? null;
}
