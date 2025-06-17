import {Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/users.model";
import {Model} from "mongoose";
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import {AuthService} from "../auth/auth.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
                private authService: AuthService,) {
    }

    private saltOrRounds: number = 10

    async register(createUserDto: CreateUserDto): Promise<User> {
        let createdUser = new this.userModel(createUserDto);
        createdUser.password = await bcrypt.hash(createUserDto.password, this.saltOrRounds);
        return createdUser.save();
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.findOne(loginUserDto);
        if (user && await bcrypt.compare(loginUserDto.password, <string>user?.password)) return this.authService.login(user);
        throw new UnauthorizedException()
    }

    async findOne(loginUserDto: LoginUserDto): Promise<UserDocument | null> {
        return this.userModel.findOne({email: loginUserDto.email}).exec()
    }
}