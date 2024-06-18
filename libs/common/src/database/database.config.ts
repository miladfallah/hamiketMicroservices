import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../../apps/user/src/entities/user.entity';
import { Admin } from 'apps/admin/src/entities/admin.entity';

export const databaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USERNAME', 'root'),
  password: configService.get<string>('DB_PASSWORD', '4900893714'),
  database: configService.get<string>('DB_NAME', 'hamiket_microservices'),
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  entities: [User, Admin],

  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
});
