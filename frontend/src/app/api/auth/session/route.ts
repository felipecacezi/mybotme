import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type CustomError = {
  message: string;
  statusCode: number;
};

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
  } catch (error) {
    const { message, statusCode } = error as CustomError;
    return NextResponse.json({ message: message ?? "Token inválido ou expirado" }, { status: statusCode ?? 401 });
  }
}
