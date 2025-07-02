import { Company } from '../../interfaces/Company.interface'
import { listAll } from '../../repositories/company/list.repository'

export class ListAll {
  async init(): Promise<Company[]> {
    return await this.execute()
  }

  async validate(): Promise<void> {}

  async execute(): Promise<Company[]> {
    return await listAll()
  }
}
