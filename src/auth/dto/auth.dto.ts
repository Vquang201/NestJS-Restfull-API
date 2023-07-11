import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
