import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string

// Caminhos que precisam de autenticação
const PROTECTED_PATHS = ["/dashboard"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log("🔍 Middleware executado para:", pathname)

  // Verifica se a rota está protegida
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (!isProtected) {
    return NextResponse.next()
  }

  const token = request.cookies.get("token")?.value

  if (!token) {
    console.log("❌ Token não encontrado, redirecionando...")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  try {
    if (!JWT_SECRET) {
      console.error("❌ JWT_SECRET não definido")
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    console.log("✅ Token válido, acesso permitido", payload)
    return NextResponse.next()
  } catch (err) {
    console.log("❌ Token inválido:", err)
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}

export const config = {
  // Matcher mais específico baseado na sua estrutura
  matcher: ["/dashboard/:path*"],
}
