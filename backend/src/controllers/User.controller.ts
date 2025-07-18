import { User } from '../entities/User.entity';
import { Create } from '../services/users/create.service'
import { ListAll } from '../services/users/listAll.service'
import { Delete } from '../services/users/delete.service'
import { Update } from '../services/users/update.service'
import { GetUserCompany } from '../services/company/getUserCompany.service'
import { Request, Response } from 'express'

export class UserController {
    constructor(
        private createService: Create,
        private listAllService: ListAll,
        private deleteService: Delete,
        private updateService: Update,
        private getUserCompany: GetUserCompany
    ) {

    }

    async list(req: Request, res: Response): Promise<any> {        
        try {
            const users = await this.listAllService.init();            
            return res.status(200).json(users);
        } catch (error: any) {           
            const statusCode = error.statusCode ?? 500;
            return res.status(statusCode).json({
                message: error.errors ?? 'Ocorreu um erro desconhecido ao buscar os usuários'
            });        
        }
    }
    async create(req: Request, res: Response): Promise<any> {        
        try {
            const body: User = req.body;            
            const user = await this.createService.init(body);                
            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                token: user.jwt_token
            });
        } catch (error: any) {
            const statusCode = error.statusCode ?? 500;
            return res.status(statusCode).json({
                message: error.errors
            });            
        }
    }
    async update(req: Request, res: Response): Promise<any> {        
        const { id } = req.params;   
           
        try {
            const body: User = req.body;            
            await this.updateService.init(body, parseInt(id));                
            return res.status(200).json({
                message: 'Usuário atualizado com sucesso',
            });
        } catch (error: any) {
            const statusCode = error.statusCode ?? 500;
            return res.status(statusCode).json({
                message: error.errors
            });            
        }
    }
    async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        try {
            this.deleteService.init(parseInt(id))            
            return res.status(200).json({
                message: 'Usuário inativado com sucesso'
            });
        } catch (error: any) {
            const statusCode = error.statusCode ?? 500;
            return res.status(statusCode).json({
                message: error.errors
            });
        }
    }

    async getCompany(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        try {
            const company = await this.getUserCompany.init(parseInt(id));                     
            return res.status(200).json({
                message: 'Empresa encontrada com sucesso',
                data: company
            });
        } catch (error: any) {
            const statusCode = error.statusCode ?? 500;
            return res.status(statusCode).json({
                message: error.errors
            });
        }
    }
}
