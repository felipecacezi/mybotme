import { authSchema } from '../../schemas/auth/auth.schema'
import { auth } from '../../repositories/auth/auth.repository'
import { z } from 'zod'
import { saveJwtToken } from '../../repositories/auth/saveJwt.repository'

export class Auth {
    async init(email: string, password: string): Promise<String|undefined> {        
      this.validate(email, password)
      return this.execute(email, password)
    }
    async validate(email: string, password: string): Promise<void> {
        try {
            authSchema.parse({email, password})       
        } catch (error: any) {            
            if (error instanceof z.ZodError) {
                throw{
                    errors: error.errors.map(e => e.message).join(", "),
                    statusCode: 400
                };
            } else {
                throw{
                    errors: error.errors ?? 'Ocorreu um erro desconhecido ao fazer o login.',
                    statusCode: error.statusCode ?? 500
                };
            }
        }
    }
    async execute(email: string, password: string): Promise<String|undefined> {
        try {
            const arAuth = await auth(email, password)   
            if (arAuth.length <= 0) {
                throw{ statusCode: 500, errors: 'E-mail ou password inválidos'}
            }     
            return await saveJwtToken(arAuth[0])
        } catch (error:any) {
            throw{
                errors: error.errors ?? 'Ocorreu um erro desconhecido ao fazer o login.',
                statusCode: error.statusCode ?? 500
            };
        }
    }
}