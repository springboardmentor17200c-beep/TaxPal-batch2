const mongoose = require('mongoose');

const deadlineSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['deadline', 'reminder', 'alert', 'other'],
        default: 'deadline'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'missed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
}, { timestamps: true });

module.exports = mongoose.model('Deadline', deadlineSchema);
