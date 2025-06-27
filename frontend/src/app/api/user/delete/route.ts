import { NextResponse } from "next/server";
import { actualUserLogged } from "@/lib/auth.helper";
import { changePassHelper } from "@/lib/changePass.helper";

type CustomError = {
  message: string;
  statusCode: number;
};

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    if (body?.password) {
      changePassHelper(
        body.password,
        body.confirmPassword
      );
    }
    const userLogged = await actualUserLogged();

    const userDeleted = await fetch(
      `${process.env.NEXT_PUBLIC_BACKENDAPI_URLBASE}user/delete/${userLogged.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userLogged.token}`,
        },
      }
    );

    const data = await userDeleted.json();
    if (!userDeleted.ok) {
      throw {
        message: data.message || "Erro ao alterar usuário",
        statusCode: userDeleted.status,
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
