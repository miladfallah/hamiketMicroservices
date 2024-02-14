// src/user/entities/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BeforeInsert,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  ActiveStatus,
  Gender,
  HideHelpStatus,
  UserType,
} from '@app/common/Enums';

import { hash } from 'bcrypt';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn() // Enforce uniqueness for id
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.Male })
  @IsString()
  @IsNotEmpty()
  gender: Gender;

  @Column({ type: 'enum', enum: UserType, default: UserType.Customer })
  @IsString()
  @IsNotEmpty()
  userType: UserType;

  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @BeforeInsert()
  async hashedPassword() {
    this.password = await hash(this.password, 10);
  }

  @Column()
  @IsString()
  @IsNotEmpty()
  @Unique(['username'])
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  phoneNumber: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @Column()
  @IsString()
  nationalCode: string;

  @Column()
  @IsString()
  picture: string;

  @Column({ type: 'enum', enum: HideHelpStatus, default: HideHelpStatus.True })
  hideHelp: HideHelpStatus;

  @Column()
  lastSeen: number;

  @Column({ type: 'enum', enum: ActiveStatus, default: ActiveStatus.INACTIVE })
  active: ActiveStatus;

  @Column()
  @IsNotEmpty()
  createdAt: number;

  @Column()
  @IsNotEmpty()
  updatedAt: number;
}
