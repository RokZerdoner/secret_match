import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {config} from "dotenv";

config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') ?? 3000;

    app.useGlobalPipes(new ValidationPipe({transform: true}));
    app.useGlobalPipes(new ValidationPipe({whitelist: true}))
    await app.listen(port);
}

bootstrap();
