import { User } from '../../interfaces/User.interface'
import { User as UserEntity } from '../../entities/User.entity'
import AppDataSource from '../../config/data-source'

export const createUser = async (userData: User) => {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const newUser = userRepository.create(userData);
    const savedUser = await userRepository.save(newUser);    
    return { id: savedUser.id, ...userData }
}