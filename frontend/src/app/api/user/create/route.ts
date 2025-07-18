import { NextResponse } from "next/server";

type CustomError = {
  message: string;
  statusCode: number;
};

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("Request body:", body);
        
       
    } catch (error) {
        const { message, statusCode } = error as CustomError;
        return NextResponse.json(
            { message: message ?? "Ocorreu um desconhecido, contate o suporte" },
            { status: statusCode ?? 500 }
        );
    }
}