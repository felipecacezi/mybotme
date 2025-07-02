import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn, 
} from 'typeorm';
import { Company } from './Company.entity';
import { User } from './User.entity';

@Entity('usersCompanies')
export class UserCompany {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'int' })
  idCompany!: number;

  @Column({ type: 'int' })
  idUser!: number;

  
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'idCompany' })
  company!: Company;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'idUser' })
  user!: User;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt!: Date;

  @Column({ type: 'int', default: 1 })// int para 1 (ativo) ou 0 (inativo)
  active!: number;
}