import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 500 })
  firstName: string;

  @Column('varchar', { length: 500 })
  lastName: string;

  @Column('varchar', { length: 500 })
  password: string;

  @Column('varchar', { length: 500, unique: true })
  email: string;

  @Column({ default: false })
  confirmed: boolean;
}
