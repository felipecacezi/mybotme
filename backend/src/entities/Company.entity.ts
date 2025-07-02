import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('companies')
@Unique(['cnpj'])
export class Company {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 18 }) 
  cnpj!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  street?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  district?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country?: string;

  @Column({ type: 'varchar', length: 9, nullable: true })
  zipcode?: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt!: Date;

  @Column({ type: 'int', default: 1 })
  active!: number;
}