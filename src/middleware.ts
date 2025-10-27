// src/middleware.ts
import { NextResponse } from 'next/server';
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const url = req.nextUrl;

    // Adicionando logs para depuração
    console.log(`[Middleware] Path: ${url.pathname}`);
    if (token) {
      console.log(`[Middleware] User: ${token.email}, mustChangePassword: ${token.mustChangePassword}`);
    } else {
      console.log(`[Middleware] No token found.`);
    }

    const mustChangePassword = token?.mustChangePassword === true;
    const isFirstAccessPage = url.pathname.startsWith('/gestor/primeiro-acesso');

    if (mustChangePassword && !isFirstAccessPage) {
      console.log(`[Middleware] Redirecting to /primeiro-acesso`);
      return NextResponse.redirect(new URL('/gestor/primeiro-acesso', req.url));
    }
    
    if (!mustChangePassword && isFirstAccessPage) {
      console.log(`[Middleware] Redirecting to /gestor`);
      return NextResponse.redirect(new URL('/gestor', req.url));
    }

    // Se nenhuma das condições acima for atendida, continua normalmente
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// O matcher continua o mesmo, está correto
export const config = {
  matcher: [
    /*
     * Aplica o middleware às seguintes rotas:
     * 1. /gestor (a rota exata do dashboard)
     * 2. Todas as sub-rotas de /gestor, EXCETO /login e /primeiro-acesso
     */
    '/gestor',
    '/gestor/((?!login|primeiro-acesso).*)',
  ],
};