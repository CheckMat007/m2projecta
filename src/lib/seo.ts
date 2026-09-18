const SITE_NAME = 'M2 Projecta';

export function normalizePageTitle(title: string): string {
  return title.replace(new RegExp(`\\s*[|\\-]\\s*${SITE_NAME}\\s*$`, 'i'), '').trim();
}