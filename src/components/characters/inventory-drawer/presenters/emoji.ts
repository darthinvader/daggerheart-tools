export function emojiForItem(item: unknown): string {
  const cat = (item as { category?: string }).category;
  if (cat === 'Utility') return '🧰';
  if (cat === 'Consumable') {
    const sub = (item as { subcategory?: string }).subcategory;
    return sub === 'Potion' ? '🧪' : '🍽️';
  }
  if (cat === 'Relic') return '🗿';
  if (cat === 'Weapon Modification') return '🛠️';
  if (cat === 'Armor Modification') return '🛡️';
  if (cat === 'Recipe') return '📜';
  return '🎒';
}
