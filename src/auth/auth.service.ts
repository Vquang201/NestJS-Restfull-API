import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable() // dependency Injection
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authDTO: AuthDTO) {
    try {
      //hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(authDTO.password, salt);

      // insert db
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword: hashPassword,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      });

      return user;
    } catch (error) {
      return { mess: error };
    }
  }

  async login(authDTO: AuthDTO) {
    try {
      // get user
      const user = await this.prismaService.user.findUnique({
        where: { email: authDTO.email },
      });

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      // compare password
      const password = await bcrypt.compare(
        authDTO.password,
        user.hashedPassword,
      );

      if (!password) {
        throw new ForbiddenException('Password not correct');
      }

      // delete field password
      delete user.hashedPassword;
      return await this.generalAccessToken(user.id, user.email);
    } catch (error) {
      return { error };
    }
  }

  async generalAccessToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });

    //try
    return { accessToken };
  }
}
