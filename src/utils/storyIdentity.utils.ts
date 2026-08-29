export function publicDisplayName(name?: string | null): string | null {
  const value = name?.trim();
  if (!value || value.includes('@')) return null;
  return value;
}

export function storyIdentityLines(item: {
  authorName?: string | null;
  location?: string | null;
  gender?: string | null;
  sexualOrientation?: string | null;
  occupation?: string | null;
  age?: number | string | null;
}): { nameLine: string | null; detailLine: string | null } {
  const name = publicDisplayName(item.authorName);
  const age =
    item.age !== null && item.age !== undefined && String(item.age).trim() !== ''
      ? String(item.age).trim()
      : null;
  const nameLine = [name, age].filter(Boolean).join(', ') || null;
  const detailLine =
    [item.location, item.gender, item.sexualOrientation, item.occupation]
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter(Boolean)
      .join(' · ') || null;

  return { nameLine, detailLine };
}
