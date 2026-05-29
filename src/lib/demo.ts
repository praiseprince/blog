const truthy = new Set(['1', 'true', 'yes', 'on']);

export const demoMode = truthy.has((process.env.DEMO_MODE ?? '').toLowerCase());

export function includeDemoEntry<T extends { data: { demo?: boolean } }>(entry: T): boolean {
  return demoMode || !entry.data.demo;
}
