import {IsString} from "class-validator";

/**
 * DTO for sending user messages
 */
export class CreateMessageDto{
    @IsString()
    message: string;
}