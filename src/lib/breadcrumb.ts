// src/lib/breadcrumb.ts
import { SITE_URL } from './site';

type Crumb = { name: string; url?: string };

// O último item de uma trilha de breadcrumb não deve ter `item` (é a página atual) —
// por isso `url` é opcional aqui: omita-o só no último crumb de cada chamada.
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      ...(crumb.url && { "item": `${SITE_URL}${crumb.url}` }),
    })),
  };
}
