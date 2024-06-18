import { ActiveStatus } from '@app/common/Enums';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ unique: true })
  userName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  mobileNumber: string;

  @Column({ nullable: true })
  nationalCode: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  level: number;

  @Column({ nullable: true })
  category: number;

  @Column({ default: '0' })
  chatAdmin: string;

  @Column({ nullable: true })
  personalCode: number;

  @Column({ type: 'enum', enum: ActiveStatus, default: ActiveStatus.INACTIVE })
  active: ActiveStatus;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;
}
