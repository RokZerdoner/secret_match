import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import {MongooseModule} from "@nestjs/mongoose";
import {MatchJoin, MatchJoinSchema} from "./schemas/match-join.model";
import {MatchModel, MatchModelSchema} from "./schemas/match.model";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [MongooseModule.forFeature([{name: MatchJoin.name, schema: MatchJoinSchema}]),
    MongooseModule.forFeature([{name: MatchModel.name, schema: MatchModelSchema}]),
  UsersModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
