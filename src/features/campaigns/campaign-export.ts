import type { Campaign } from '@/lib/schemas/campaign';

/**
 * Trigger a file download in the browser from a Blob.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Sanitise a campaign name into a filesystem-friendly slug. */
function slugify(name: string): string {
  return name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

/**
 * Export a campaign as a JSON file download.
 * Creates a Blob from the campaign data and triggers a browser download.
 */
export function exportCampaignAsJson(campaign: Campaign): void {
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: 1,
    campaign,
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, `${slugify(campaign.name)}-export.json`);
}

/**
 * Export a campaign as a human-readable Markdown file download.
 */
export function exportCampaignAsMarkdown(campaign: Campaign): void {
  const lines: string[] = [];

  // Header
  lines.push(`# Campaign: ${campaign.name}`);
  const phase = campaign.phase ?? 'act-1';
  const playerCount = campaign.players?.length ?? 0;
  const sessionCount = campaign.sessions?.length ?? 0;
  lines.push(
    `**Phase:** ${phase} | **Players:** ${playerCount} | **Sessions:** ${sessionCount}`
  );
  lines.push('');

  // NPCs
  const npcs = campaign.npcs ?? [];
  if (npcs.length > 0) {
    lines.push('## NPCs');
    for (const npc of npcs) {
      const disposition = npc.disposition ?? 'neutral';
      lines.push(`### ${npc.name} (${disposition})`);
      if (npc.motivation) lines.push(`**Motive:** ${npc.motivation}`);
      if (npc.description) lines.push(`**Description:** ${npc.description}`);
      if (npc.personality) lines.push(`**Personality:** ${npc.personality}`);
      lines.push('');
    }
  }

  // Locations
  const locations = campaign.locations ?? [];
  if (locations.length > 0) {
    lines.push('## Locations');
    for (const loc of locations) {
      lines.push(`### ${loc.name}`);
      if (loc.atmosphere) lines.push(`**Atmosphere:** ${loc.atmosphere}`);
      if (loc.description) lines.push(`**Description:** ${loc.description}`);
      lines.push('');
    }
  }

  // Quests
  const quests = campaign.quests ?? [];
  if (quests.length > 0) {
    lines.push('## Quests');
    for (const quest of quests) {
      const status = quest.status ?? 'available';
      lines.push(`### ${quest.title} (${status})`);
      if (quest.description)
        lines.push(`**Description:** ${quest.description}`);
      lines.push('');
    }
  }

  // Sessions
  const sessions = campaign.sessions ?? [];
  if (sessions.length > 0) {
    lines.push('## Sessions');
    for (const session of sessions) {
      const dateStr = session.date ?? 'no date';
      const status = session.status ?? 'planned';
      lines.push(
        `### Session ${session.sessionNumber} - ${dateStr} (${status})`
      );
      if (session.agenda) lines.push(`**Agenda:** ${session.agenda}`);
      if (session.summary) lines.push(`**Summary:** ${session.summary}`);
      lines.push('');
    }
  }

  const markdown = lines.join('\n');
  const blob = new Blob([markdown], { type: 'text/markdown' });
  downloadBlob(blob, `${slugify(campaign.name)}-export.md`);
}
