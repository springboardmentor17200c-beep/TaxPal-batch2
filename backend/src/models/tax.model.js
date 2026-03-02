const mongoose = require('mongoose');

const taxEstimateSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quarter: {
        type: String,
        required: true,
        enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    estimated_tax: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
        default: () => new Date().getFullYear(),
    }
}, { timestamps: true });

// Compound index to ensure one estimate per quarter per year per user
taxEstimateSchema.index({ user_id: 1, quarter: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('TaxEstimate', taxEstimateSchema);
