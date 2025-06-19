import {IsBoolean, IsDate, IsMongoId} from "class-validator";
import {Pair} from "../schemas/match.model";

/**
 * DTO for creating match
 */
export class CreateMatchDto{
    @IsMongoId()
    admin: string;

    pairs: Pair[]

    @IsDate()
    dateCreated: Date;

    @IsBoolean()
    hasFinnished: boolean;
}