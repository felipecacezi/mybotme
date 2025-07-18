import { Company } from "../../interfaces/Company.interface";
import { getByUserId } from "../../repositories/userCompany/getByUserId.repository";
import { getCompanyByUserId } from "../../schemas/userCompany/get.schema";
import { z } from "zod";

export class GetUserCompany {
  async init(id: number): Promise<Company[]> {
    await this.validate(id);
    return await this.execute(id);
  }

  async validate(id: number): Promise<void> {
    try {
      getCompanyByUserId.parse({
        userId: id,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw {
          errors: error.errors.map((e) => e.message).join(", "),
          statusCode: 400,
        };
      } else {
        throw {
          errors:
            error.message ??
            "Ocorreu um erro desconhecido ao buscar a empresa vinculada ao usuário.",
          statusCode: error.statusCode ?? 500,
        };
      }
    }
  }

  async execute(id: number): Promise<Company[]> {
    return await getByUserId(id);
  }
}
