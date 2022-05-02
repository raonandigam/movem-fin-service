import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { VeriteService } from 'src/verite/verite.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private veriteService: VeriteService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    try {
      const passwordMatches = await bcrypt.compare(pass, user.password_hash);
      if (user && passwordMatches) {
        const { password_hash, ...result } = user;
        return user;
      }
    } catch (_) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Email / Password incorrect.',
      }, HttpStatus.UNAUTHORIZED);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);
    const payload = { userId: user._id, email: user.email, name: user.name, wallet_address : user.wallet_address ?? null, circle_wallet: user.circle_wallet ?? null  };
    return {
      access_token: this.jwtService.sign(payload), kyc: user.kyc ?? false,
    };
  }

  async register(userInput: RegisterDto) {
    const passwordHash = await this.getHash(userInput.password);
    const createUserDto: CreateUserDto = {
      ...userInput,
      password_hash: passwordHash,
      wallet_address: null
    };
    try{
      const createdUser = await this.usersService.create(createUserDto);
  
      const payload = {
        userId: createdUser._id,
        email: createdUser.email,
        name: createdUser.name,
        wallet_address: createdUser.wallet_address
      };

      //Issue KYC 
      this.veriteService.issueKYC(createdUser._id);

      return {
        access_token: this.jwtService.sign(payload),
      };
    }catch (_) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Email already exist.',
      }, HttpStatus.UNAUTHORIZED);
    }
  }

  private async getHash(password: string) {
    // const salt = await bcrypt.genSalt();
    const rounds = 10;
    const hash = await bcrypt.hash(password, rounds);
    return hash;
  }
}
