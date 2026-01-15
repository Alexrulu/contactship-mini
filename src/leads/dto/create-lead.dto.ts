import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateLeadDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;
}
