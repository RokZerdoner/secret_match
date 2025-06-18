import {IsDate, IsMongoId} from "class-validator";

export class CreateJoinMatchDto{
    @IsMongoId()
    user: string;

    @IsDate()
    timeJoined: Date;
}