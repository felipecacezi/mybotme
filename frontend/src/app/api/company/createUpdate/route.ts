import { NextResponse } from "next/server";
import { removeCnpjMask } from "@/lib/stringPatrerns.helper";
import { CompanyData } from "../../../../interfaces/company/CompanyData.interface";
import { actualUserLogged } from "@/lib/auth.helper";

type CustomError = {
  message: string;
  statusCode: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let response;
    if (body.cnpj) {
      body.cnpj = removeCnpjMask(body.cnpj);
    }

    if (!body.id) {
      response = await createCompany(body);
    } else {
      response = await updateCompany(body);
    }
    
    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "Erro ao gravar empresa",
        statusCode: response.status,
      };
    }

    return NextResponse.json(
      { success: true, message: data.message, data },
      { status: 200 }
    );
  } catch (error) {
    const { message, statusCode } = error as CustomError;
    return NextResponse.json(
      { success: false, message: message ?? "Erro desconhecido no BFF" },
      { status: statusCode ?? 500 }
    );
  }
}


const createCompany = async (company: CompanyData) => {
  const userLogged = await actualUserLogged();
  return await fetch(
    `${process.env.NEXT_PUBLIC_BACKENDAPI_URLBASE}company/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userLogged.token}`,
      },
      body: JSON.stringify(company),
    }
  );
};

const updateCompany = async (company: CompanyData) => {
  const userLogged = await actualUserLogged();  
  return await fetch(
    `${process.env.NEXT_PUBLIC_BACKENDAPI_URLBASE}company/update/${company.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userLogged.token}`,
      },
      body: JSON.stringify(company),
    }
  );
};
