import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Model} from "mongoose";

/**
 * class Pair,
 * it saves all players within that par and also other statistical info for later use
 */
export class Pair{
    constructor() {
        this.players = [];
        this.havePlayed = false;
        this.whichPlayerWon = null;
    }
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    players: mongoose.Types.ObjectId[];

    @Prop({default: false})
    havePlayed: boolean;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null})
    whichPlayerWon: null
}

/**
 * Match model,
 * It has info about matches
 */
@Schema()
export class MatchModel{
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    admin: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Types.Array})
    pairs: Pair[];

    @Prop({ type: Date, default: Date.now })
    dateCreated: Date;

    @Prop({default: false})
    hasFinnished: boolean;
}

export const MatchModelSchema = SchemaFactory.createForClass(MatchModel)