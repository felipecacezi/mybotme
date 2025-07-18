import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from 'jose'
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string
const PROTECTED_PATHS = ["/dashboard"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (!isProtected) {
    return NextResponse.next()
  }

  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  try {
    if (!JWT_SECRET) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    const secret = new TextEncoder().encode(JWT_SECRET)
    await jwtVerify(token, secret)
    return NextResponse.next({})
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}

export const config = {
  // Matcher mais específico baseado na sua estrutura
  matcher: ["/dashboard/:path*"],
}
