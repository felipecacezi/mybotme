import { User } from '../../interfaces/User.interface'
import { createUser } from '../../repositories/users/create.repository'
import { listByEmail } from '../../repositories/users/list.repository'
import { userSchema } from '../../schemas/user/create.schema'
import { z } from 'zod'

export class Create {
    async init(userData: User): Promise<User> {        
        await this.validate(userData)
        const createdUser = await this.execute(userData)        
        return createdUser;
    }
    async validate(userData: User): Promise<void> {
        try {
            userSchema.parse(userData);
            const user = await listByEmail(userData.email)            
            if (user.length > 0) {
                throw{
                    status: 400,
                    message: 'Impossível cadastrar: usuário ja cadastrado com o e-mail informado.'
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
                    errors: error.message ?? 'Ocorreu um erro desconhecido ao cadastrar o usuario.',
                    statusCode: error.status ?? 500
                };
            }
        }
    }
    async execute(userData: User): Promise<User> {
        return await createUser({ active: 1,...userData })
    }
}