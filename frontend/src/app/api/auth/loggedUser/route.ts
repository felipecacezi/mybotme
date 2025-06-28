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
    const decoded = jwt.verify(token, secret);

    if (typeof decoded !== 'object' || !decoded.id || !decoded.name || !decoded.email) {
      throw {
        message: "Token inválido ou expirado",
        status: 401
      }
    }
    
    return NextResponse.json({ 
        user: {
            name: decoded.name,
            email: decoded.email,
            avatar: "/avatars/shadcn.jpg",
        },
        success: true,
    }, { 
        status: 200 
    });
  } catch (err) {
    return NextResponse.json({ message: "Token inválido ou expirado" }, { status: 401 });
  }
}
