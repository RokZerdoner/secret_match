import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {MatchService} from "./match.service";
import {AuthGuard} from "../auth/auth.guard";
import {CurrentUserTokenDecorator} from "../auth/secrets/current-user-token.decorator";
import {RolesGuard} from "../roles/roles.guard";
import {Roles} from "../roles/roles.decorator";
import {Role} from "../roles/role.enum";
import {CreateMessageDto} from "./dto/create-message.dto";

@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {
    }

    @UseGuards(AuthGuard)
    @Post('join')
    async join(@CurrentUserTokenDecorator() user: any) {
        const newUserJoinMatch = {
            user: user.sub,
            timeJoined: new Date(),
        };
        return this.matchService.create(newUserJoinMatch);
    }

    @UseGuards(AuthGuard)
    @Post('join_message')
    async joinMessage(@CurrentUserTokenDecorator() user: any, @Body() createMessageDto: CreateMessageDto) {
        const newUserJoinMatch = {
            user: user.sub,
            timeJoined: new Date(),
            message: createMessageDto.message,
        };
        return this.matchService.createWithMessage(newUserJoinMatch);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('assign')
    async assign(@CurrentUserTokenDecorator() user: any){
        const createMatchModel = {
            admin: user.sub,
            pairs: [],
            dateCreated: new Date(),
            hasFinnished: false,
        }
        return this.matchService.assign(createMatchModel);
    }

    @UseGuards(AuthGuard)
    @Get('view')
    async view(@CurrentUserTokenDecorator() user: any) {
        return this.matchService.view(user.sub);
    }
}