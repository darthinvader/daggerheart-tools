import {
  MAX_TOTAL_LEVEL,
  MIN_PRIMARY_LEVEL,
  MIN_SECONDARY_LEVEL,
} from './constants';
import type { MulticlassConfig } from './types';

export function getTotalLevel(config: MulticlassConfig): number {
  return config.primaryLevel + config.secondaryLevel;
}

export function canAddSecondary(config: MulticlassConfig): boolean {
  return config.primaryLevel >= 2 && config.secondaryClass === null;
}

export function getMaxSecondaryLevel(_config: MulticlassConfig): number {
  return MAX_TOTAL_LEVEL - MIN_PRIMARY_LEVEL;
}

export function getMaxPrimaryLevel(config: MulticlassConfig): number {
  if (config.secondaryClass === null) return MAX_TOTAL_LEVEL;
  return MAX_TOTAL_LEVEL - MIN_SECONDARY_LEVEL;
}

export function validateMulticlassConfig(config: MulticlassConfig): string[] {
  const errors: string[] = [];

  if (config.primaryLevel < MIN_PRIMARY_LEVEL) {
    errors.push(`Primary class must be at least level ${MIN_PRIMARY_LEVEL}`);
  }

  if (config.secondaryClass !== null) {
    if (config.secondaryLevel < MIN_SECONDARY_LEVEL) {
      errors.push(
        `Secondary class must be at least level ${MIN_SECONDARY_LEVEL}`
      );
    }
    if (config.primaryClass === config.secondaryClass) {
      errors.push('Primary and secondary class cannot be the same');
    }
  }

  if (getTotalLevel(config) > MAX_TOTAL_LEVEL) {
    errors.push(`Total level cannot exceed ${MAX_TOTAL_LEVEL}`);
  }

  return errors;
}

export function formatClassDisplay(config: MulticlassConfig): string {
  if (!config.secondaryClass) {
    return `${config.primaryClass} ${config.primaryLevel}`;
  }
  return `${config.primaryClass} ${config.primaryLevel} / ${config.secondaryClass} ${config.secondaryLevel}`;
}
