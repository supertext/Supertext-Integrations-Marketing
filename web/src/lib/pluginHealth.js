// Totals from Supertext Plugin Health (its statistics API: totals only, never sites or clients).
// The token is the one in Plugin Health's COMMANDO_STATS_TOKEN; without it the adoption figures are left out.

const PLUGIN_HEALTH_URL = (process.env.PLUGIN_HEALTH_URL || 'https://pluginhealth.supertext.com').replace(/\/$/, '');

/** The statistics (see Plugin Health's developer guide → Statistics API), or null when unavailable. */
export async function getPluginHealthStats(includeLocal = false) {
  const token = process.env.PLUGIN_HEALTH_STATS_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`${PLUGIN_HEALTH_URL}/api/v1/stats${includeLocal ? '?local=1' : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.warn(`[stats] Plugin Health answered ${res.status}`);
      return null;
    }
    const body = await res.json();
    return body?.ok ? body : null;
  } catch (error) {
    console.warn(`[stats] Plugin Health: ${error.message}`);
    return null;
  }
}

/** Plugin names in Plugin Health that differ from the repository name the integration links to. */
const ALIASES = { 'supertext-wordpress-polylang': ['wordpress-polylang-supertext-translation'] };

/** The integration a Plugin Health plugin name belongs to (by repository name), or null. */
export function integrationFor(plugin, integrations) {
  const names = [plugin.toLowerCase(), ...(ALIASES[plugin.toLowerCase()] || [])];
  return (
    integrations.find((i) => {
      const repo = (i.repo || '').split('/').pop().toLowerCase();
      return repo && (names.includes(repo) || (ALIASES[repo] || []).some((a) => names.includes(a)));
    }) || null
  );
}
