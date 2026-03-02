const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    period: {
        type: String,
        required: true, // e.g., "Jan 2025", "Q2 2024", "Current Month"
    },
    report_type: {
        type: String,
        required: true, // e.g., "summary", "detailed", "tax", "Income Statement"
    },
    file_path: {
        type: String,
        required: true, // File path or URL where the report is stored
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
