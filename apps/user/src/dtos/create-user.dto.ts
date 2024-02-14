// create-user.dto.ts
import {
  ActiveStatus,
  Gender,
  HideHelpStatus,
  UserType,
} from '@app/common/Enums';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
  IsEnum,
  IsMobilePhone,
  IsOptional,
} from 'class-validator';
import { Unique } from 'typeorm';

@Unique(['id'])
@Unique(['username'])
export class CreateUserDto {
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'firstName at least 3' })
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'lastName at least 3' })
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender, { message: 'Gender should be either 1(male) or 2(female)' })
  readonly gender: Gender;

  @IsOptional()
  @IsEnum(UserType, {
    message: 'User type should be eather 1(seller) or 2(customer)',
  })
  readonly userType: UserType;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'password at least 8' })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'username at least 6' })
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsMobilePhone('fa-IR')
  readonly mobileNumber: string;

  // Ensure that nationalCode is exactly 10 digits
  @IsString({ message: 'National Code must be a string' })
  @Length(10, 10, { message: 'National Code must be exactly 10 digits long' })
  readonly nationalCode: string;

  @IsString()
  @IsOptional()
  readonly picture: string;

  @IsEnum(HideHelpStatus, {
    message: 'hideHelp status is 0(false) or 1(true)',
  })
  @IsOptional()
  readonly hideHelp: HideHelpStatus;

  readonly lastSeen: number;

  @IsNotEmpty()
  @IsEnum(ActiveStatus, {
    message: 'active status should be 0(inactive or 1(active))',
  })
  @IsOptional()
  readonly active: ActiveStatus;

  readonly createdAt: number;

  readonly updatedAt: number;
}
