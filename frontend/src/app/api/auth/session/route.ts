import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      throw {
        message: "Token inválido ou expirado",
        status: 401
      }
    }
    
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;    
    jwt.verify(token, secret);

    return NextResponse.json({ 
        message: "Autenticado com sucesso"
    }, { 
        status: 200 
    });
  } catch (err) {
    return NextResponse.json({ message: "Token inválido ou expirado" }, { status: 401 });
  }
}
