// create-user.dto.ts
import { Gender, UserType } from '@app/common/Enums';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsBoolean,
  Length,
  MinLength,
  IsEnum,
  IsMobilePhone,
} from 'class-validator';
import { Unique } from 'typeorm';

@Unique(['id'])
@Unique(['username'])
export class CreateUserDto {
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'at least 3' })
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'at least 3' })
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender, { message: 'Gender should be either male or female' })
  readonly gender: Gender;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserType, {
    message: 'User type should be eather 1(seller) or 2(customer)',
  })
  readonly userType: UserType;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'at least 8' })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'at least 6' })
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsMobilePhone('fa-IR')
  mobile: string;
  readonly mobileNumber: string;

  // Ensure that nationalCode is exactly 10 digits
  @IsString({ message: 'National Code must be a string' })
  @Length(10, 10, { message: 'National Code must be exactly 10 digits long' })
  readonly nationalCode: string;

  @IsString()
  readonly picture: string;

  @IsBoolean()
  readonly hideHelp: boolean;

  readonly lastSeen: number;

  @IsBoolean()
  @IsNotEmpty()
  readonly active: boolean;

  readonly createdAt: number;

  readonly updatedAt: number;
}
