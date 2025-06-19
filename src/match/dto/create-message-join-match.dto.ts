import {IsDate, IsMongoId, IsString} from "class-validator";

/**
 * DTO for sending user messages and joining the matches
 */
export class CreateMessageJoinMatchDto {
    @IsMongoId()
    user: string;

    @IsString()
    message: string;

    @IsDate()
    timeJoined: Date;
}