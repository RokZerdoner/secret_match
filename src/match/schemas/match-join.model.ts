import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {HydratedDocument} from "mongoose";

export type MatchJoinDocument = HydratedDocument<MatchJoin>;

@Schema()
export class MatchJoin {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: mongoose.Types.ObjectId;

    @Prop({ type: Date, default: Date.now })
    timeJoined: Date;
}

export const MatchJoinSchema = SchemaFactory.createForClass(MatchJoin)