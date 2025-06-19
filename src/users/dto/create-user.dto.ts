import {IsEmail, IsNotEmpty, IsStrongPassword} from "class-validator";
import {Role} from "../../roles/role.enum";

/**
 * DTO for registration
 */
export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    role: Role;
}