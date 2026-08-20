// src/components/JsonLd.tsx

// `JSON.stringify` sozinho não é seguro para injetar dentro de uma <script> tag: se o
// conteúdo (título de post, descrição de serviço, resposta de FAQ etc. — todos editáveis
// pelo CMS) contiver a sequência "</script>", ela fecha a tag prematuramente e permite
// injetar HTML/JS arbitrário na página. Escapar "<" neutraliza isso sem alterar o JSON.
function toSafeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toSafeJsonLd(data) }}
    />
  );
}
