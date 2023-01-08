import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";

export type TaskDocument = Task & Document;
@Schema()
export class Task {
    @Prop()
    title: string;
    @Prop()
    description: string;
    @Prop({ default: Date.now() })
    creationDate: Date
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    createdBy: User
}
export const TaskSchema = SchemaFactory.createForClass(Task)