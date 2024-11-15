import { Schema, model } from "mongoose"

const todoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    completed:{
        type:Boolean,
        default:false
    }

}, {
    timestamps: true
});

const Todo = model('Todo', todoSchema);

export { Todo }