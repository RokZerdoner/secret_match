import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {LoginUserDto} from "./dto/login-user.dto";
import {Public} from "../auth/secrets/public.secrets";
import {AuthGuard} from "../auth/auth.guard";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto){
        return this.usersService.login(loginUserDto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('register')
    register(@Body() createUserDto: CreateUserDto){
        return this.usersService.register(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('test')
    getTest() {
        return 'You are verified';
    }
}