// src/user/entities/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Gender, UserType } from '@app/common/Enums';
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

  @Column()
  @IsString()
  @IsNotEmpty()
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

  @Column()
  @IsBoolean()
  hideHelp: boolean;

  @Column()
  lastSeen: number;

  @Column()
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @Column()
  @IsNotEmpty()
  createdAt: number;

  @Column()
  @IsNotEmpty()
  updatedAt: number;
}
