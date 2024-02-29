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

  @Column({ nullable: true })
  @IsString()
  firstName: string;

  @Column({ nullable: true })
  @IsString()
  lastName: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.Male })
  @IsString()
  gender: Gender;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.Customer,
  })
  @IsString()
  userType: UserType;

  @Column({ nullable: true })
  @IsString()
  password: string;

  @BeforeInsert()
  async hashedPassword() {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }

  @Column({ nullable: true })
  @IsString()
  @Unique(['username'])
  username: string;

  @Column({ nullable: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsString()
  phoneNumber: string;

  @Column({ nullable: true })
  @IsString()
  mobileNumber: string;

  @Column({ nullable: true })
  @IsString()
  nationalCode: string;

  @Column({ nullable: true })
  @IsString()
  picture: string;

  @Column({
    type: 'enum',
    enum: HideHelpStatus,
    default: HideHelpStatus.True,
    nullable: true,
  })
  hideHelp: HideHelpStatus;

  @Column({ nullable: true })
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
