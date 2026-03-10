const Deadline = require('../models/deadline.model');

exports.createDeadline = async (req, res) => {
    try {
        const { title, description, dueDate, type, priority } = req.body;
        const deadline = await Deadline.create({
            user_id: req.user,
            title,
            description,
            dueDate,
            type,
            priority
        });
        res.status(201).json({ success: true, data: deadline });
    } catch (error) {
        console.error('Create deadline error:', error);
        res.status(500).json({ success: false, message: 'Server error creating deadline' });
    }
};

exports.getDeadlines = async (req, res) => {
    try {
        const deadlines = await Deadline.find({ user_id: req.user }).sort({ dueDate: 1 });
        res.json({ success: true, count: deadlines.length, data: deadlines });
    } catch (error) {
        console.error('Get deadlines error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching deadlines' });
    }
};

exports.updateDeadline = async (req, res) => {
    try {
        const { id } = req.params;
        const deadline = await Deadline.findOneAndUpdate(
            { _id: id, user_id: req.user },
            req.body,
            { new: true, runValidators: true }
        );
        if (!deadline) {
            return res.status(404).json({ success: false, message: 'Deadline not found' });
        }
        res.json({ success: true, data: deadline });
    } catch (error) {
        console.error('Update deadline error:', error);
        res.status(500).json({ success: false, message: 'Server error updating deadline' });
    }
};

exports.deleteDeadline = async (req, res) => {
    try {
        const { id } = req.params;
        const deadline = await Deadline.findOneAndDelete({ _id: id, user_id: req.user });
        if (!deadline) {
            return res.status(404).json({ success: false, message: 'Deadline not found' });
        }
        res.json({ success: true, message: 'Deadline deleted' });
    } catch (error) {
        console.error('Delete deadline error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting deadline' });
    }
};
