
import { IsEmail, IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
 
export class RegisterDto {
  @IsEmail()
  email: string;
 
  @IsString()
  @IsNotEmpty()
  name: string;
 
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string[];

}
 
export default RegisterDto;