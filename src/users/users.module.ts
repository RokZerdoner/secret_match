import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./schemas/users.model";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {AuthService} from "../auth/auth.service";

@Module({
    imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema }])],
    controllers: [UsersController],
    providers: [UsersService, AuthService],
    exports: [UsersService]
})
export class UsersModule {}