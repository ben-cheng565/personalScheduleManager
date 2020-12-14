import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    created: Date,
    due: Date,
    modified: Date,
    isComplete: { type: Boolean, default: false },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    color: { type: String, enum: ['Red', 'Green', 'Blue'], default: 'Red' }
});

export const Todo = mongoose.model('Todo', todoSchema);