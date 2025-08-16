import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import React from 'react';

import { ExperiencesCard } from '@/components/characters/experiences-card';

describe('ExperiencesCard', () => {
  it('allows adding a new experience', () => {
    const experiences: any[] = [];
    const addExperience = (item: any) => experiences.push(item);
    const updateExperienceAt = (i: number, next: any) =>
      (experiences[i] = next);
    const removeExperienceAt = (i: number) => experiences.splice(i, 1);

    render(
      <ExperiencesCard
        experiences={experiences}
        addExperience={addExperience}
        updateExperienceAt={updateExperienceAt}
        removeExperienceAt={removeExperienceAt}
      />
    );

    const input = screen.getByPlaceholderText(
      'New experience title'
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Scout Training' } });
    fireEvent.click(screen.getByText('Add'));
    expect(experiences.length).toBe(1);
    expect(experiences[0].name).toBe('Scout Training');
  });
});
