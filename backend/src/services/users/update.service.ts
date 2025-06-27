import { User } from '../../interfaces/User.interface'
import { updateUser } from '../../repositories/users/update.repository'
import { listById } from '../../repositories/users/list.repository'
import { updateSchema, idSchema } from '../../schemas/user/update.schema'
import { z } from 'zod'

export class Update {
    async init(userData: User, id: number): Promise<User> {        
        await this.validate(userData, id)
        return await this.execute(userData, id)
    }
    async validate(userData: User, id: number): Promise<void> {
        try {
            updateSchema.parse(userData)
            idSchema.parse(id)      
            const user = await listById(id)            
            if (user.length <= 0) {
                throw{
                    status: 400,
                    message: 'Impossível alterar: usuário inválido ou não existente.'
                }                
            }        
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                throw{
                    errors: error.errors.map(e => e.message).join(", "),
                    statusCode: 400
                };
            } else {
                throw{
                    errors: error.message ?? 'Ocorreu um erro desconhecido ao alterar o usuário.',
                    statusCode: error.status ?? 500
                };
            }
        }
    }
    async execute(userData: User, id: number): Promise<User> {
        console.log('teste', userData);
        
        return await updateUser(userData, id)
    }
}