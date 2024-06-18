import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dtos/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { ActiveStatus, AppError, JwTokenService } from '@app/common';
import { PasswordService } from '@app/common/utils/checkPassword';
import { User } from 'apps/user/src/entities/user.entity';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly jwTokenService: JwTokenService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { mobileNumber, password, ...adminData } = createAdminDto;
    // Check if admin with the given mobile number already exists
    const existingAdmin = await this.adminRepository.findOne({
      where: { mobileNumber },
    });
    if (existingAdmin) {
      throw new AppError(
        'Admin with this mobile number already exists',
        HttpStatus.CONFLICT,
      );
    }
    // Check if user with the given mobile number exists
    const user = await this.userRepository.findOne({ where: { mobileNumber } });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // date of now
    const nowDate: number = new Date().getTime() / 1000;
    // Create a new admin entity
    const newAdmin = this.adminRepository.create({
      ...adminData,
      mobileNumber,
      password: hashedPassword,
      userId: user ? user.id : null,
      active: ActiveStatus.INACTIVE,
      createdAt: nowDate,
      updatedAt: nowDate,
    });

    // Set the user ID if found
    if (user) {
      newAdmin.userId = user.id;
    }

    // Save the new admin entity to the database
    return this.adminRepository.save(newAdmin);
  }

  async update(
    authenticatedUser: User,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    const adminToUpdate = await this.adminRepository.findOneBy({
      mobileNumber: authenticatedUser.mobileNumber,
    });

    if (!adminToUpdate) {
      // Handle case where admin with given mobile number is not found
      throw new AppError('Admin not found', HttpStatus.NOT_FOUND);
    }

    // Use the spread operator to copy properties from updateAdminDto to adminToUpdate
    const updatedAdmin = { ...adminToUpdate, ...updateAdminDto };

    updatedAdmin.updatedAt = Math.floor(new Date().getTime() / 1000);

    if (updateAdminDto.password) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(updateAdminDto.password, 10);
      updatedAdmin.password = hashedPassword;
    }
    return await this.adminRepository.save(updatedAdmin);
  }

  async login(password: string, userName: string): Promise<any> {
    if (!password || !userName) {
      throw new AppError(
        'userName and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const admin: Admin = await this.adminRepository.findOneBy({
      userName: userName,
    });
    if (!admin) {
      throw new AppError('No admin found!', HttpStatus.NOT_FOUND);
    }

    if (admin.active === ActiveStatus.INACTIVE) {
      throw new AppError('Admin is not active', HttpStatus.FORBIDDEN);
    }
    // Compare the provided password with the hashed password
    await this.passwordService.comparePassword(password, admin.password);

    const adminToken = this.jwTokenService.generateToken(admin, 'admin');
    await this.jwTokenService.saveTokenInRedis(adminToken, admin.id);
    return {
      state: true,
      status: 'login',
      adminToken,
      successCode: '1',
      admin,
    };
  }
}
