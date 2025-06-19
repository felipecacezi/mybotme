import { User } from '../../interfaces/User.interface'
import { listAll } from '../../repositories/users/list.repository'

export class ListAll {
    async init(): Promise<User[]> {        
      return await this.execute()
    }
    async validate(): Promise<void> {
        
    }
    async execute(): Promise<User[]> {
        return await listAll()
    }
}