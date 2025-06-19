import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {HydratedDocument} from "mongoose";

export type MatchJoinDocument = HydratedDocument<MatchJoin>;

/**
 * Match join model,
 * It has info of who has joined the match
 */
@Schema()
export class MatchJoin {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    user: mongoose.Types.ObjectId;

    @Prop({default: ""})
    message: string;

    @Prop({type: Date, default: Date.now})
    timeJoined: Date;
}

export const MatchJoinSchema = SchemaFactory.createForClass(MatchJoin)