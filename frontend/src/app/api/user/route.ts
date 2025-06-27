import { NextResponse } from "next/server";
type CustomError = {
  message: string;
  statusCode: number;
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKENDAPI_URLBASE}user/create`,
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
                message: data.message,
                statusCode: data.statusCode
            };
        }

        const nextResponse = NextResponse.json(
            { message: data.message },
            { status: 201 }
        );

        nextResponse.cookies.set("token", data.token, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 60 * 60 * 24,
            sameSite: "lax",
        });

        return nextResponse;
    } catch (error) {
        const { message, statusCode } = error as CustomError;
        return NextResponse.json(
            { message: message ?? "Ocorreu um desconhecido, contate o suporte" },
            { status: statusCode ?? 500 }
        );
    }
}