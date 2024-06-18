// create-user.dto.ts
import {
  ActiveStatus,
  Gender,
  HideHelpStatus,
  UserType,
} from '@app/common/Enums';
import {
  IsEmail,
  IsString,
  Length,
  MinLength,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  readonly id: number;

  @IsString()
  @MinLength(3, { message: 'firstName at least 3' })
  readonly firstName: string;

  @IsString()
  @MinLength(3, { message: 'lastName at least 3' })
  readonly lastName: string;

  @IsString()
  @IsEnum(Gender, { message: 'Gender should be either 1(male) or 2(female)' })
  readonly gender: Gender;

  @IsOptional()
  @IsEnum(UserType, {
    message: 'User type should be eather 1(seller) or 2(customer)',
  })
  readonly userType: UserType;

  @IsString()
  @MinLength(8, { message: 'password at least 8' })
  readonly password: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phoneNumber: string;

  @IsString()
  @IsMobilePhone('fa-IR')
  readonly mobileNumber: string;

  // Ensure that nationalCode is exactly 10 digits
  @IsString({ message: 'National Code must be a string' })
  @Length(10, 10, { message: 'National Code must be exactly 10 digits long' })
  readonly nationalCode: string;

  @IsNumber()
  readonly birthDate: number;

  @IsString()
  @IsOptional()
  readonly picture: string;

  @IsEnum(HideHelpStatus, {
    message: 'hideHelp status is 0(false) or 1(true)',
  })
  @IsOptional()
  readonly hideHelp: HideHelpStatus;

  readonly lastSeen: number;

  @IsEnum(ActiveStatus, {
    message: 'active status should be 0(inactive) or 1(active)',
  })
  @IsOptional()
  readonly active: ActiveStatus;

  readonly createdAt: number;

  readonly updatedAt: number;
}
