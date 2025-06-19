import { User as UserEntity } from '../../entities/User.entity'
import AppDataSource from '../../config/data-source'

export const deleteUser = async (userId: number) => {
    const result = await AppDataSource.getRepository(UserEntity)
        .createQueryBuilder()
        .update(UserEntity)
        .set({ active: 2 })
        .where("id = :id", { id: userId })
        .execute()

    if (result.affected === 0) {
        throw new Error("Usuário inválido")
    }
    return { id: userId }
}