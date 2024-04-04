import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service'; // Adjust the path based on your project structure
import { Repository } from 'typeorm';
import { User } from 'apps/user/src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) // Inject the repository
    private readonly userRepository: Repository<User>,
  ) {
    const secret = 'secret';
    console.log('JwtStrategy initialized with secret:', secret);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: any): Promise<any> {
    // Retrieve user from the database using the user ID from the JWT payload
    const user = await this.userRepository.findOneBy({ id: payload.sub });

    // If the user is not found, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
