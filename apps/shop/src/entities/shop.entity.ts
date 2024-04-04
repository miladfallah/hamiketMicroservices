import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  isNumber,
  isString,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ActiveStatus, ApprovalStatus } from '@app/common/Enums';
@Entity('shop')
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  economicName: string;

  @Column()
  @IsNumber()
  category: number;

  @Column()
  @IsNumber()
  userId: number;

  @Column()
  @IsString()
  activity: string;

  @Column()
  @IsString()
  treeCategory: string;

  @Column({ length: 10 })
  @IsString()
  melliCode: string;

  @Column()
  @IsString()
  shopDescription: string;

  @Column()
  @IsString()
  // casteId, code senfi
  guildCode: string;

  @Column()
  @IsNumber()
  addressId: number;

  @Column()
  @IsString()
  phone: string;

  @Column({ length: 11 })
  @IsString()
  mobileNumber: string;

  @Column({ length: 10 })
  @IsString()
  postalCode: string;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.ACCEPT,
  })
  @IsString()
  approvalStatus: ApprovalStatus;

  @Column({ nullable: true })
  @IsString()
  picture: string;

  @Column()
  @IsNumber()
  views: number;

  @Column()
  @IsEmail()
  email: string;

  @Column({ type: 'enum', enum: ActiveStatus, default: ActiveStatus.ACTIVE })
  active: ActiveStatus;

  @Column()
  @IsNumber()
  inquiryTime: number;

  @Column()
  @IsNotEmpty()
  createdAt: number;

  @Column()
  @IsNotEmpty()
  updatedAt: number;
}
