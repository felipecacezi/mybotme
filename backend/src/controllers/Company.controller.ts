import { Request, Response } from "express";
// Importe as interfaces e os schemas Zod
// import { Company as CompanyInterface } from "../interfaces/Company.interface";
import {
  CreateCompanyInput,
  createCompanySchema,
} from "../schemas/company/create.schema";
import {
  UpdateCompanyInput,
  updateCompanySchema,
} from "../schemas/company/update.schema";
import {
  DeleteCompanyInput,
  deleteCompanySchema,
  companyIdSchema,
} from "../schemas/company/delete.schema";
import { z } from "zod";

// Importe os serviços que você criará
import { Create as CreateCompanyService } from "../services/company/create.service";
import { ListAll as ListAllCompaniesService } from "../services/company/listAll.service";
import { Update as UpdateCompanyService } from "../services/company/update.service";
import { Delete as DeleteCompanyService } from "../services/company/delete.service";

export class CompanyController {
  constructor(
    // Injeção de dependência dos serviços
    private createService: CreateCompanyService,
    private updateService: UpdateCompanyService,
    private deleteService: DeleteCompanyService,
    private listAllService: ListAllCompaniesService,
  ){}

  /**
   * Lista todas as empresas.
   */
    async list(req: Request, res: Response): Promise<Response> {
      try {
        const companies = await this.listAllService.init();
        return res.status(200).json(companies);
      } catch (error: any) {
        // Usa statusCode se disponível, senão, 500 (Erro Interno do Servidor)
        const statusCode = error.statusCode ?? 500;
        return res.status(statusCode).json({
          message:
            error.errors ?? "Ocorreu um erro desconhecido ao buscar as empresas",
        });
      }
    }

  /**
   * Cria uma nova empresa.
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body;
      const company = await this.createService.init(body);

      return res.status(201).json({
        message: "Empresa criada com sucesso",
        // companyId: company.id, // Retorna o ID da empresa criada
      });
    } catch (error: any) {
      // Tratamento específico para erros de validação do Zod
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      const statusCode = error.statusCode ?? 500;
      return res.status(statusCode).json({
        message:
          error.errors ?? "Ocorreu um erro desconhecido ao criar a empresa",
      });
    }
  }

  /**
   * Atualiza uma empresa existente.
   */
    async update(req: Request, res: Response): Promise<Response> {
      const { id } = req.params;
      const body = req.body;

      try {
        await this.updateService.init(parseInt(id), body);

        return res.status(200).json({
          message: "Empresa atualizada com sucesso",
        });
      } catch (error: any) {
        console.log('error', error);
        
        if (error instanceof z.ZodError) {
          return res.status(400).json({ errors: error.errors });
        }
        const statusCode = error.statusCode ?? 500;
        return res.status(statusCode).json({
          message:
            error.errors ?? "Ocorreu um erro desconhecido ao atualizar a empresa",
        });
      }
    }

  /**
   * Inativa (marca como inativa) uma empresa.
   */
    async delete(req: Request, res: Response): Promise<Response> {
      const { id } = req.params;

      try {
        // Valida o ID da URL para inativação/exclusão
        const companyId = deleteCompanySchema.parse({ id: parseInt(id) }).id; // Parseando como objeto para o deleteSchema

        // Chama o serviço de inativação/exclusão lógica
        await this.deleteService.init(companyId);

        return res.status(200).json({
          message: "Empresa inativada com sucesso",
        });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ errors: error.errors });
        }
        const statusCode = error.statusCode ?? 500;
        return res.status(statusCode).json({
          message:
            error.errors ?? "Ocorreu um erro desconhecido ao inativar a empresa",
        });
      }
    }
}
