import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/users.model";
import {Model} from "mongoose";
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import {AuthService} from "../auth/auth.service";
import * as bcrypt from 'bcrypt';
import {Role} from "../roles/role.enum";

/**
 * Logic for user related methods
 */
@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
                private authService: AuthService,) {
    }

    private saltOrRounds: number = 10

    /**
     * User registration,
     * It creates user with name, email and password,
     * It encrypts password and add the user role (Role.admin or Role.User)
     * @param createUserDto
     */
    async register(createUserDto: CreateUserDto): Promise<User> {
        let createdUser = new this.userModel(createUserDto);
        createdUser.password = await bcrypt.hash(createUserDto.password, this.saltOrRounds);
        createdUser.role = Role.User; // If you want to make it admin, just change this to Role.admin
        return createdUser.save();
    }

    /**
     * User login
     * @param loginUserDto
     * it checks whether there is user with provided email,
     * Then it encrypts password and compares it with the one inside the DB
     */
    async login(loginUserDto: LoginUserDto) {
        const user = await this.findOne(loginUserDto);
        if (user && await bcrypt.compare(loginUserDto.password, <string>user?.password)) return this.authService.login(user);
        throw new UnauthorizedException()
    }

    /**
     * Checks whether user with that email exists or not
     * @param loginUserDto
     */
    async findOne(loginUserDto: LoginUserDto): Promise<UserDocument | null> {
        return this.userModel.findOne({email: loginUserDto.email}).exec()
    }

    /**
     * Returns user info from its id
     * @param userId
     * It is used within match.view for receiving some of the users info
     */
    async getUsernameAndEmail(userId: string){
        let user = await this.userModel.findOne({_id: userId}).exec()
        if(user === null) throw new NotFoundException()
        return {
            user_id: user?.id,
            name: user.name,
            email: user.email
        }
    }
}