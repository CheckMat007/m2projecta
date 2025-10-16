// src/middleware.ts

import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {
    // console.log(req.nextauth.token) // Use para debugar, se necessário
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Retorna `true` se o usuário tiver um token (está logado)
        if (token) return true

        // Se não tiver token, permite acesso apenas à página de login
        if (req.nextUrl.pathname.startsWith('/gestor/login')) return true

        // Caso contrário, nega o acesso
        return false
      }
    }
  }
)

// O matcher define as rotas onde o middleware roda
export const config = { 
  matcher: ['/gestor/:path*'] 
}
