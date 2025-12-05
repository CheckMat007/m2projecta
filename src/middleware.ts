// src/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;
  const pathname = url.pathname;

  const role = token?.role;
  // const authMethod = token?.authMethod; // REMOVIDO: Não usamos mais isso
  const mustChangePassword = token?.mustChangePassword === true;

  // ==============================================================
  // ZONA DO GESTOR (/gestor)
  // ==============================================================
  if (pathname.startsWith('/gestor')) {
    const isLoginPage = pathname === '/gestor/login';
    const isFirstAccessPage = pathname === '/gestor/primeiro-acesso';

    // CASO A: USUÁRIO LOGADO
    if (token) {
      // Segurança: Cliente não entra aqui
      if (role === 'CLIENT') {
        return NextResponse.redirect(new URL('/cliente', req.url));
      }
      
      // Se estiver no Login, manda pro Dashboard
      if (isLoginPage) {
        return NextResponse.redirect(new URL('/gestor', req.url));
      }

      // Lógica de Primeiro Acesso
      if (mustChangePassword && !isFirstAccessPage) {
        return NextResponse.redirect(new URL('/gestor/primeiro-acesso', req.url));
      }
      if (!mustChangePassword && isFirstAccessPage) {
        return NextResponse.redirect(new URL('/gestor', req.url));
      }

      return NextResponse.next();
    }

    // CASO B: USUÁRIO NÃO LOGADO
    else {
      if (!isLoginPage) {
        return NextResponse.redirect(new URL('/gestor/login', req.url));
      }
      return NextResponse.next();
    }
  }

  // ==============================================================
  // ZONA DO CLIENTE (/cliente)
  // ==============================================================
  if (pathname.startsWith('/cliente')) {
    const isLoginPage = pathname === '/cliente/login';
    const isFirstAccessPage = pathname === '/cliente/primeiro-acesso';

    // CASO A: USUÁRIO LOGADO
    if (token) {
      // Segurança: Gestor não entra aqui
      if (role !== 'CLIENT') {
        return NextResponse.redirect(new URL('/gestor', req.url));
      }

      // Se estiver no Login, manda pro Dashboard
      if (isLoginPage) {
        return NextResponse.redirect(new URL('/cliente', req.url));
      }

      // Lógica de Primeiro Acesso
      if (mustChangePassword && !isFirstAccessPage) {
        return NextResponse.redirect(new URL('/cliente/primeiro-acesso', req.url));
      }
      if (!mustChangePassword && isFirstAccessPage) {
        return NextResponse.redirect(new URL('/cliente', req.url));
      }

      return NextResponse.next();
    }

    // CASO B: USUÁRIO NÃO LOGADO
    else {
      if (!isLoginPage) {
        return NextResponse.redirect(new URL('/cliente/login', req.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/gestor/:path*',
    '/cliente/:path*',
  ],
};