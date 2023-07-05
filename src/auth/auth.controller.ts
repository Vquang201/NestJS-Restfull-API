import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Req() req: Request) {
    console.log(req.body);

    return this.authService.register();
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
