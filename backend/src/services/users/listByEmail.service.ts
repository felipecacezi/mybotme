import { User } from '../../interfaces/User.interface'
import { listByEmail } from '../../repositories/users/list.repository'

export class ListByEmail {
    async init(email: string): Promise<User[]> {        
      return await this.execute(email)
    }
    async validate(): Promise<void> {
        
    }
    async execute(email: string): Promise<User[]> {
        return await listByEmail(email)
    }
}