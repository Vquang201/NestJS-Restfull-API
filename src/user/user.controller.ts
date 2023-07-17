import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators';
import { User } from '@prisma/client';
import { MyJWTGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(MyJWTGuard)
  @Get('me')
  me(@GetUser() user: User) {
    console.log('user', user);

    return user;
  }
}
