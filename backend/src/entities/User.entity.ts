import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn({ name: 'onCreated' })
  onCreated!: Date;

  @UpdateDateColumn({ name: 'onUpdated' })
  onUpdated!: Date;

  @Column()
  active!: number;

  @Column()
  jwt_token!: string;
}
