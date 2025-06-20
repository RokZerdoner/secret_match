import {
    ConflictException,
    Injectable,
    MethodNotAllowedException,
    NotFoundException,
    UnprocessableEntityException
} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {MatchJoin} from "./schemas/match-join.model";
import {Model} from "mongoose";
import {CreateJoinMatchDto} from "./dto/create-join-match.dto";
import {MatchModel, Pair} from "./schemas/match.model";
import {CreateMatchDto} from "./dto/create-match.dto";
import {UsersService} from "../users/users.service";
import {CreateMessageJoinMatchDto} from "./dto/create-message-join-match.dto";
import {MailingService} from "../mailing/mailing.service";

/**
 * The logic of match methods
 */
@Injectable()
export class MatchService {
    constructor(@InjectModel(MatchJoin.name) private matchJoinModel: Model<MatchJoin>,
                @InjectModel(MatchModel.name) private matchModel: Model<MatchModel>,
                private userService: UsersService,
                private mailingService: MailingService) {
    }

    /**
     * Creating new matchJoin entity
     * @param createMatchJoinDto
     * From jwt token it gets user data, which is then stored in document called match joins,
     * All users can only join ONCE,
     * Message is set to empty string,
     */
    async create(createMatchJoinDto: CreateJoinMatchDto): Promise<MatchJoin> {
        let checkIfAlreadyExists = await this.matchJoinModel.findOne({user: createMatchJoinDto.user}).exec()
        if (checkIfAlreadyExists !== null) throw ConflictException;
        let createdMatchJoin = new this.matchJoinModel(createMatchJoinDto);
        createdMatchJoin.message = "";
        return createdMatchJoin.save();
    }

    /**
     * Creating new matchJoin entity with messages
     * @param createMessageMatchJoinDto
     *  The same as create, but Users can now add messages
     */
    async createWithMessage(createMessageMatchJoinDto: CreateMessageJoinMatchDto): Promise<MatchJoin> {
        let checkIfAlreadyExists = await this.matchJoinModel.findOne({user: createMessageMatchJoinDto.user}).exec()
        if (checkIfAlreadyExists !== null) throw ConflictException;
        let createdMatchJoin = new this.matchJoinModel(createMessageMatchJoinDto);
        return createdMatchJoin.save();
    }

    /**
     * It creates match entity
     * @param createMatchDto
     * Admins can create matches which are before assign in default state
     */
    async createMatch(createMatchDto: CreateMatchDto): Promise<MatchModel> {
        let createdMatch = new this.matchModel(createMatchDto);
        return createdMatch.save();
    }

    /**
     * It generates pairs from users inside matchJoins entity
     * @param createMatchDto
     * At random, it generates pairs of users in which there is no self pairing,
     * If there is odd number for final user it just save that one as the only participant, which would mean, that he already won the match
     */
    async assign(createMatchDto: CreateMatchDto): Promise<MatchModel> {
        const NUMBER_OF_PLAYERS = 2; // number of users inside each pair
        let getAllParticipants = await this.findAll();

        if (getAllParticipants.length < 2) throw new MethodNotAllowedException();

        while (getAllParticipants.length > 0) {
            if (getAllParticipants.length === 1) { // checking if only one user remains
                let newPair = new Pair();
                newPair.players.push(getAllParticipants[0].user);
                createMatchDto.pairs.push(newPair);
                break;
            }
            let newPair = new Pair();
            for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
                const index: number = Math.floor(Math.random() * getAllParticipants.length);
                newPair.players.push(getAllParticipants[index].user);
                getAllParticipants.splice(index, 1);
            }
            createMatchDto.pairs.push(newPair);
        }

        const hasDeleted = await this.deleteAll(); // calling delete all function
        if (hasDeleted) return this.createMatch(createMatchDto);
        throw new UnprocessableEntityException();
    }

    /**
     * Returning the other users in the same pair as the provided user is
     * @param userId
     * It returns the ID, NAME and EMAIL of other participants within the same match pair,
     * It only uses the pairs inside the last match, that hasnt finnished
     */
    async view(userId: string): Promise<object | null> {
        const latestMatch = await this.findLast();
        if (latestMatch === null) throw new NotFoundException();
        for (const pair of latestMatch.pairs) {
            for (let i = 0; i < pair.players.length; i++) {
                const player = pair.players[i];

                if (player.toString() === userId) {
                    pair.players.splice(i, 1);
                    if (pair.players.length > 0) {
                        const otherPlayerId = pair.players[0].toString();
                        let res =  await this.userService.getUsernameAndEmail(otherPlayerId); // getting all important information form user with id
                        let res2 =  await this.userService.getUsernameAndEmail(userId); // getting all important information form user with id
                        await this.mailingService.sendUsersTheirPair(res2, res);
                        return res;
                    } else {
                        return {
                            message: "You are the only one in your match pair. You already won"
                        };
                    }
                }
            }
        }
        return null;
    }

    /**
     * Returns the last match that hasn't finnished
     */
    async findLast(): Promise<MatchModel | null> {
        return this.matchModel.findOne({hasFinnished: false}).exec();
    }

    /**
     * Returns all participants of the match
     */
    async findAll(): Promise<MatchJoin[]> {
        return this.matchJoinModel.find().exec();
    }

    /**
     * Removes all users from matchJoin (it is used, when match and pairings are created)
     */
    async deleteAll() {
        return this.matchJoinModel.deleteMany().exec();
    }
}
