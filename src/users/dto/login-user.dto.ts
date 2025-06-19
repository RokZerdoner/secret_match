import {IsEmail, IsStrongPassword} from "class-validator";

/**
 * DTO for login
 */
export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}