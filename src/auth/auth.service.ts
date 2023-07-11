import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable() // dependency Injection
export class AuthService {
  constructor(private prismaService: PrismaService) {}
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

      delete user.hashedPassword;
      return { mess: 'Login SuccessFully', user };
    } catch (error) {
      return { error };
    }
  }
}
