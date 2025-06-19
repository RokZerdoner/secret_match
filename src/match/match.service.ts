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

@Injectable()
export class MatchService {
    constructor(@InjectModel(MatchJoin.name) private matchJoinModel: Model<MatchJoin>,
                @InjectModel(MatchModel.name) private matchModel: Model<MatchModel>,
                private userService: UsersService) {
    }

    async create(createMatchJoinDto: CreateJoinMatchDto): Promise<MatchJoin> {
        let checkIfAlreadyExists = await this.matchJoinModel.findOne({user: createMatchJoinDto.user}).exec()
        if (checkIfAlreadyExists !== null) throw ConflictException;
        let createdMatchJoin = new this.matchJoinModel(createMatchJoinDto);
        createdMatchJoin.message = "";
        return createdMatchJoin.save();
    }

    async createWithMessage(createMessageMatchJoinDto: CreateMessageJoinMatchDto) : Promise<MatchJoin>{
        let checkIfAlreadyExists = await this.matchJoinModel.findOne({user: createMessageMatchJoinDto.user}).exec()
        if (checkIfAlreadyExists !== null) throw ConflictException;
        let createdMatchJoin = new this.matchJoinModel(createMessageMatchJoinDto);
        return createdMatchJoin.save();
    }

    async createMatch(createMatchDto: CreateMatchDto): Promise<MatchModel> {
        let createdMatch = new this.matchModel(createMatchDto);
        return createdMatch.save();
    }

    async assign(createMatchDto: CreateMatchDto): Promise<MatchModel> {
        const NUMBER_OF_PLAYERS = 2;
        let getAllParticipants = await this.findAll();

        if (getAllParticipants.length < 2) throw new MethodNotAllowedException();

        while (getAllParticipants.length > 0) {
            if (getAllParticipants.length === 1) {
                let newPair = new Pair();
                newPair.players.push(getAllParticipants[0].user);
                createMatchDto.pairs.push(newPair);
                break;
            }
            let newPair = new Pair();
            for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
                const index: number = Math.floor(Math.random() * getAllParticipants.length);
                console.log(getAllParticipants[index].user);
                newPair.players.push(getAllParticipants[index].user);
                getAllParticipants.splice(index, 1);
            }
            createMatchDto.pairs.push(newPair);
        }

        const hasDeleted = await this.deleteAll();
        if (hasDeleted) return this.createMatch(createMatchDto);
        throw new UnprocessableEntityException();
    }

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
                        return await this.userService.getUsernameAndEmail(otherPlayerId);
                    } else {
                        return null;
                    }
                }
            }
        }
        return null;
    }

    async findLast(): Promise<MatchModel | null> {
        return this.matchModel.findOne({hasFinnished: false}).exec();
    }

    async findAll(): Promise<MatchJoin[]> {
        return this.matchJoinModel.find().exec();
    }

    async deleteAll() {
        return this.matchJoinModel.deleteMany().exec();
    }
}
