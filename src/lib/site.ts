// src/lib/site.ts
export const SITE_URL = 'https://www.m2projecta.com.br';

// Referenciar a variável aqui (em vez de `process.env.NEXT_PUBLIC_...!` em cada
// formulário) permite checar em um único lugar se ela está configurada, e o Next.js
// ainda faz a substituição em tempo de build normalmente pois este módulo é
// importado nos componentes cliente que usam a constante.
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
