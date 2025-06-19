import {IsDate, IsMongoId, IsString} from "class-validator";

export class CreateMessageJoinMatchDto {
    @IsMongoId()
    user: string;

    @IsString()
    message: string;

    @IsDate()
    timeJoined: Date;
}