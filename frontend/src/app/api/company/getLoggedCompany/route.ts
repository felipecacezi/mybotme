import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      throw {
        message: "Token inválido ou expirado",
        statusCode: 401,
      };
    }
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      throw {
        message: "Token inválido ou expirado",
        statusCode: 401,
      };
    }
    
    const userId = decoded.id;
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKENDAPI_URLBASE}user/company/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const backendData = await backendResponse.json();
    if (!backendResponse.ok) {
      throw {
        message: backendData.message || "Erro ao buscar empresa",
        statusCode: backendResponse.status,
      };
    }

    return NextResponse.json(
      {
        success: true,
        data: backendData.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro GET BFF /api/company:", error);
    const customError = error as { message?: string; statusCode?: number };
    return NextResponse.json(
      {
        success: false,
        message: customError.message || "Erro desconhecido no BFF",
      },
      { status: customError.statusCode || 500 }
    );
  }
}
