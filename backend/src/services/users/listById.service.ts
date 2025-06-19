import { User } from '../../interfaces/User.interface'
import { listById } from '../../repositories/users/list.repository'

export class ListById {
    async init(id: number): Promise<User[]> {        
      return await this.execute(id)
    }
    async validate(): Promise<void> {
        
    }
    async execute(id: number): Promise<User[]> {
        return await listById(id)
    }
}