export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function composeEditorialStoryInput(input: {
  isConfession: boolean;
  body: string;
  aboutYou: string;
  context: string;
}): string {
  const sections = [input.isConfession ? 'CONFESSION:' : 'MEDITATION:', input.body.trim()];

  if (input.aboutYou.trim()) {
    sections.push('', 'ABOUT THE AUTHOR:', input.aboutYou.trim());
  }

  if (input.context.trim()) {
    sections.push(
      '',
      input.isConfession ? 'ABOUT THE MAIN CHARACTER:' : 'BRING THE MEDITATION ALIVE:',
      input.context.trim(),
    );
  }

  return sections.join('\n');
}
