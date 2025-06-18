import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {UsersModule} from "./users/users.module";
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/secretMatch'), UsersModule, AuthModule, MatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
