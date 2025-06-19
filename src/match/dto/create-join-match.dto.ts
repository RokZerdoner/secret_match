import {IsDate, IsMongoId} from "class-validator";

/**
 * DTO for joining the matches
 */
export class CreateJoinMatchDto{
    @IsMongoId()
    user: string;

    @IsDate()
    timeJoined: Date;
}