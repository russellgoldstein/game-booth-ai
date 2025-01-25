import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' }) // This should not cause an error if TypeORM is correctly set up
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  googleId!: string;

  @Column()
  displayName!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ default: true })
  isActive!: boolean;
}
