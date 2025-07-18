import { NextResponse } from "next/server";
import { actualUserLogged } from "@/lib/auth.helper";
import { changePassHelper } from "@/lib/changePass.helper";

type CustomError = {
  message: string;
  statusCode: number;
};

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (body?.newPassword) {
      changePassHelper(body.newPassword, body.confirmPassword);
    }
    const userLogged = await actualUserLogged();
    const userUpdate = await fetch(
      `${process.env.NEXT_PUBLIC_BACKENDAPI_URLBASE}user/update/${userLogged.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userLogged.token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await userUpdate.json();
    if (!userUpdate.ok) {
      throw {
        message: data.message || "Erro ao alterar usuário",
        statusCode: userUpdate.status,
      };
    }

    const nextResponse = NextResponse.json(
      { message: data.message, success: true },
      { status: 200 }
    );

    // Verifica se o backend retornou um novo token
    if (data.token) {
      nextResponse.cookies.set("token", data.token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1 dia
        sameSite: "lax",
        // secure: true, // Descomente em produção para HTTPS
      });
    }

    return nextResponse;
  } catch (error) {
    const { message, statusCode } = error as CustomError;
    return NextResponse.json(
      {
        message: message ?? "Ocorreu um erro desconhecido, contate o suporte",
        success: false,
      },
      { status: statusCode ?? 500 }
    );
  }
}
