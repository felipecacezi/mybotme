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
      changePassHelper(
        body.newPassword,
        body.confirmPassword
      );
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
        body: JSON.stringify({ password: body?.newPassword }),
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
    return nextResponse;
  } catch (error) {
    const { message, statusCode } = error as CustomError;
    return NextResponse.json(
      {
        message: message ?? "Ocorreu um desconhecido, contate o suporte",
        success: false,
      },
      { status: statusCode ?? 500 }
    );
  }
}
