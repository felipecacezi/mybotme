import { Company as CompanyInterface } from '../../interfaces/Company.interface';
import { createCompanySchema, CreateCompanyInput } from '../../schemas/company/create.schema';
import { createCompany } from '../../repositories/company/create.repository';
import { getCompanyByCnpj } from '../../repositories/company/getByCnpj.repository';
import { z } from 'zod';

export class Create {
    /**
     * Ponto de entrada principal para a criação de uma empresa.
     * Orquestra a validação e a execução da criação.
     * @param companyData Os dados da empresa a serem criados.
     * @returns A empresa criada.
     * @throws Um objeto de erro com statusCode e message/errors.
     */
    async init(companyData: CreateCompanyInput): Promise<CompanyInterface> {
        await this.validate(companyData);
        const createdCompany = await this.execute(companyData);
        return createdCompany;
    }

    /**
     * Realiza validações de negócio e formato dos dados.
     * @param companyData Os dados da empresa a serem validados.
     * @throws Um objeto de erro com statusCode e message/errors se alguma validação falhar.
     */
    async validate(companyData: CreateCompanyInput): Promise<void> {
        try {
            createCompanySchema.parse(companyData);
            const existingCompany = await getCompanyByCnpj(companyData.cnpj);
            if (existingCompany) {
                throw {
                    statusCode: 400,
                    message: 'Impossível cadastrar: empresa já cadastrada com o CNPJ informado.'
                };
            }
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                throw {
                    errors: error.errors.map(e => e.message).join(", "),
                    statusCode: 400
                };
            } else {
                throw {
                    errors: error.message ?? 'Ocorreu um erro desconhecido ao cadastrar a empresa.',
                    statusCode: error.statusCode ?? 500
                };
            }
        }
    }

    /**
     * Executa a lógica principal de criação da empresa, chamando o repositório.
     * @param companyData Os dados da empresa a serem criados.
     * @returns A empresa criada.
     * @throws Um objeto de erro com statusCode e message/errors se houver falha ao salvar.
     */
    async execute(companyData: CreateCompanyInput): Promise<CompanyInterface> {
        try {
            const newCompany = await createCompany(companyData);

            if (!newCompany) {
                throw {
                    statusCode: 500,
                    message: 'Falha interna ao criar a empresa.'
                };
            }
            return newCompany;
        } catch (error: any) {
            if (error.statusCode) {
                throw error;
            } else {
                console.error('Erro inesperado na execução da criação da empresa:', error);
                throw {
                    errors: 'Ocorreu um erro desconhecido ao criar a empresa.',
                    statusCode: 500
                };
            }
        }
    }
}