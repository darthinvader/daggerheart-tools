const ITEM_EMOJI_MAP: Record<string, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  potion: '🧪',
  tool: '🔧',
  scroll: '📜',
  food: '🍖',
  gem: '💎',
  book: '📚',
};

export function getItemEmoji(item: {
  category?: string;
  type?: string;
}): string {
  const searchStr = `${item.category ?? ''} ${item.type ?? ''}`.toLowerCase();
  for (const [key, emoji] of Object.entries(ITEM_EMOJI_MAP)) {
    if (searchStr.includes(key)) return emoji;
  }
  return '📦';
}
