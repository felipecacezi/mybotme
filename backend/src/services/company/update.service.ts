import { Company as CompanyInterface } from "../../interfaces/Company.interface";
import {
  UpdateCompanyInput,
  updateCompanySchema,
} from "../../schemas/company/update.schema";
import { companyIdSchema } from "../../schemas/company/delete.schema";
import { updateCompany } from "../../repositories/company/update.repository";
import { getCompanyById } from "../../repositories/company/getById.repository";
import { getCompanyByCnpj } from "../../repositories/company/getByCnpj.repository";
import { z } from "zod";

export class Update {
  /**
   * Ponto de entrada principal para a atualização de uma empresa.
   * Orquestra a validação e a execução da atualização.
   * @param id O ID da empresa a ser atualizada.
   * @param companyData Os dados da empresa para atualização.
   * @returns A empresa atualizada.
   * @throws Um objeto de erro com statusCode e message/errors.
   */
  async init(
    id: number,
    companyData: UpdateCompanyInput
  ): Promise<CompanyInterface> {
    await this.validate(id, companyData);
    return await this.execute(id, companyData);
  }

  /**
   * Realiza validações de negócio e formato dos dados para atualização.
   * @param id O ID da empresa a ser validada.
   * @param companyData Os dados da empresa para validação.
   * @throws Um objeto de erro com statusCode e message/errors se alguma validação falhar.
   */
  async validate(id: number, companyData: UpdateCompanyInput): Promise<void> {
    try {
      // 1. Valida o ID da empresa
      companyIdSchema.parse(id);

      // 2. Valida o corpo da requisição com o schema Zod (campos opcionais)
      updateCompanySchema.parse(companyData);

      // 3. Verifica se a empresa com o ID fornecido existe
      const existingCompany = await getCompanyById(id);
      if (!existingCompany) {
        throw {
          statusCode: 404, // Not Found
          message: "Empresa não encontrada ou ID inválido.",
        };
      }

      // 4. Se um CNPJ for fornecido na atualização, verifica sua unicidade
      if (companyData.cnpj) {
        const companyWithSameCnpj = await getCompanyByCnpj(companyData.cnpj);
        // Se encontrar uma empresa com o mesmo CNPJ E não for a própria empresa que está sendo atualizada
        if (companyWithSameCnpj && companyWithSameCnpj.id !== id) {
          throw {
            statusCode: 400,
            message:
              "Impossível alterar: CNPJ já está em uso por outra empresa.",
          };
        }
      }
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
            "Ocorreu um erro desconhecido ao atualizar a empresa.",
          statusCode: error.statusCode ?? 500,
        };
      }
    }
  }

  /**
   * Executa a lógica principal de atualização da empresa, chamando o repositório.
   * @param id O ID da empresa a ser atualizada.
   * @param companyData Os dados da empresa para atualização.
   * @returns A empresa atualizada.
   * @throws Um objeto de erro com statusCode e message/errors se houver falha na atualização.
   */
  async execute(
    id: number,
    companyData: UpdateCompanyInput
  ): Promise<CompanyInterface> {
    try {
      const updatedCompany = await updateCompany(id, companyData);
      if (!updatedCompany) {
        // Isso pode acontecer se o repositório não encontrar a empresa para atualizar
        // Ou se a operação de atualização não retornar a empresa.
        // O erro de "não encontrada" já é tratado em validate, então este é para falha no save.
        throw {
          statusCode: 500,
          message: "Falha interna ao atualizar a empresa no banco de dados.",
        };
      }
      return updatedCompany;
    } catch (error: any) {
        console.log('error', error);
        
      if (error.statusCode) {
        throw error;
      } else {
        console.error(
          "Erro inesperado na execução da atualização da empresa:",
          error
        );
        throw {
          errors: "Ocorreu um erro desconhecido ao atualizar a empresa.",
          statusCode: 500,
        };
      }
    }
  }
}
