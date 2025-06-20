import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {UsersModule} from "./users/users.module";
import {AuthModule} from './auth/auth.module';
import {MatchModule} from './match/match.module';
import {MailingService} from './mailing/mailing.service';
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('DATABASE_URL'),
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        AuthModule,
        MatchModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
