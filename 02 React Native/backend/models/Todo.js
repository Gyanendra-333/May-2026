import { Schema, model } from "mongoose";

const todoSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model("Todo", todoSchema);