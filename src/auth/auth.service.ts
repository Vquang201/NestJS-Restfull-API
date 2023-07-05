import { Injectable } from '@nestjs/common';
import { User, Note } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable() // dependency Injection
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  register() {
    return {
      mes: ' REGISTER',
    };
  }

  login() {
    return {
      mes: ' LOGIN',
    };
  }
}
