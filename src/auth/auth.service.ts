import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserDocument} from "../users/schemas/users.model";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
    ) {
    }

    async login(user: UserDocument) {
        const payload = {username: user.email, sub: user._id, role: user.role}
        return {access_token: await this.jwtService.signAsync(payload),}
    }
}
