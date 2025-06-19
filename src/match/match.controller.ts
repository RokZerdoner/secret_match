import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {MatchService} from "./match.service";
import {AuthGuard} from "../auth/auth.guard";
import {CurrentUserTokenDecorator} from "../auth/secrets/current-user-token.decorator";
import {RolesGuard} from "../roles/roles.guard";
import {Roles} from "../roles/roles.decorator";
import {Role} from "../roles/role.enum";
import {CreateMessageDto} from "./dto/create-message.dto";

/**
 * Controller for match api endpoint
 */
@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {
    }

    /**
     * Users (and admins) can join match with valid jwt token
     * @param user
     * From jwt token it gets user data, which is then stored in document called match joins.
     * All users can only join ONCE
     */
    @UseGuards(AuthGuard)
    @Post('join')
    async join(@CurrentUserTokenDecorator() user: any) {
        const newUserJoinMatch = {
            user: user.sub,
            timeJoined: new Date(),
        };
        return this.matchService.create(newUserJoinMatch);
    }

    /**
     * The same as join, but users can also add message within body as { 'message': 'your message'}
     * @param user
     * @param createMessageDto
     */
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

    /**
     * Admins can now create match pairs from all users tha have joined
     * @param user
     */
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('assign')
    async assign(@CurrentUserTokenDecorator() user: any) {
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