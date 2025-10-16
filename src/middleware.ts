// src/middleware.ts

import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` anexa o token do usuário ao request.
  function middleware(_req) {
    // console.log(req.nextauth.token) // Use para debugar, se necessário
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Retorna `true` se o usuário tiver um token (está logado)
        if (token) return true
        
        // Se não tiver token, permite o acesso apenas se a página for a de login
        // Isso evita o loop de redirecionamento.
        if (req.nextUrl.pathname.startsWith('/gestor/login')) return true

        // Se não tiver token e não for a página de login, nega o acesso (redireciona)
        return false
      }
    }
  }
)

// O matcher continua o mesmo, pois queremos que o middleware rode em todas as rotas do gestor
export const config = { 
  matcher: ['/gestor/:path*'] 
}