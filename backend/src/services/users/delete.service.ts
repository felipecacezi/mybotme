import { User } from '../../interfaces/User.interface'
import { deleteUser } from '../../repositories/users/delete.repository'
import { deleteSchema } from '../../schemas/user/delete.schema'
import { z } from 'zod'
import { UpdateResult } from "typeorm";

export class Delete {
    async init(id: number): Promise<{id: number}> {        
       this.validate(id)
       return this.execute(id)
    }
    async validate(id: number): Promise<void> {
        try {
            deleteSchema.parse({id})            
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                throw{
                    errors: error.errors.map(e => e.message).join(", "),
                    statusCode: 400
                };
            } else {
                throw{
                    errors: error.message ?? 'Ocorreu um erro desconhecido ao deletar o usuário.',
                    statusCode: error.status ?? 500
                };
            }            
        }
    }
    async execute(id: number): Promise<{id: number}> {
        return await deleteUser(id)
    }
}