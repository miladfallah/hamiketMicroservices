import { ActiveStatus } from '@app/common';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsNumber()
  readonly id: number;

  @IsNumber()
  userId?: number;

  @IsString()
  readonly userName: string;

  @IsString()
  @MinLength(3, { message: 'firstName at least 3' })
  readonly firstName?: string;

  @IsString()
  @MinLength(3, { message: 'firstName at least 3' })
  readonly lastName?: string;

  @IsString()
  @Length(11, 11, { message: 'mobile number must be 11 number' })
  readonly mobileNumber: string;

  @IsNumber()
  @Length(10, 10, { message: 'mobile number must be 11 number' })
  readonly nationalCode?: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8, { message: 'password at least 8' })
  password: string;

  @IsString()
  readonly level: number;

  @IsNumber()
  readonly category?: number;

  @IsNumber()
  readonly personalCode?: number;

  @IsEnum(ActiveStatus, {
    message: 'active status should be 0(inactive) or 1(active)',
  })
  @IsOptional()
  readonly active: ActiveStatus;
  readonly createdAt: number;

  readonly updatedAt?: number;
}
