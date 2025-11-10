export function normalizeTeamId(value: any): number | null {
  if (value === 0 || value === undefined || value === null) return null;
  return value;
}
