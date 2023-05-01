import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { userEntity } from './Dto/authAPI.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async signIn(username: string, pass: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      username: user.username,
      name: user.name,
      email: user.email,
    };

    return {
      user: {
        ...payload,
        access_token: await this.jwtService.signAsync(payload),
      },
    };
  }

  async register(userData: userEntity): Promise<userEntity | string> {
    const saltOrRounds = await bcrypt.genSaltSync();
    const hash = await bcrypt.hashSync(userData.pass, saltOrRounds);

    const checkUsername = await this.prisma.user.findFirst({
      where: {
        username: userData.username,
      },
    });

    if (checkUsername) {
      return 'Username tekan';
    }

    let newPlayer = {
      ...userData,
      pass: hash,
      salt: saltOrRounds,
    };

    const create = await this.prisma.user.create({
      data: newPlayer,
    });

    return create;
  }

  async GetProfile(token: string): Promise<any> {
    const profile = await this.jwtService.decode(token);
    return profile;
  }
}
