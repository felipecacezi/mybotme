import { NextResponse } from "next/server";

type CustomError = {
  message: string;
  statusCode: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKENDAPI_URLBASE}auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "Erro ao fazer login",
        statusCode: response.status,
      };
    }

    const nextResponse = NextResponse.json(
      { message: "Login realizado com sucesso" },
      { status: 201 }
    );

    nextResponse.cookies.set("token", data.token, {
      httpOnly: true,
      // secure: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 dia
      sameSite: "lax",
    });

    return nextResponse;
  } catch (error) {
    const { message, statusCode } = error as CustomError;
    return NextResponse.json(
      {
        message: message ?? "Erro inesperado ao fazer login. Tente novamente.",
      },
      { status: statusCode ?? 500 }
    );
  }
}
