const { validationResult } = require('express-validator');
const TaxEstimate = require('../models/tax.model');
const Transaction = require('../models/transaction.model');

exports.estimateTax = async (req, res) => {
    try {
        const { region, year } = req.body;
        const currentYear = year || new Date().getFullYear();

        // Get user's transactions for the year
        const transactions = await Transaction.find({
            user_id: req.user,
            date: {
                $gte: new Date(currentYear, 0, 1),
                $lte: new Date(currentYear, 11, 31, 23, 59, 59)
            }
        });

        let income = 0;
        let expenses = 0;

        transactions.forEach(t => {
            if (t.type === 'income') income += t.amount;
            if (t.type === 'expense') expenses += t.amount; // basic deductible expenses
        });

        const netIncome = Math.max(0, income - expenses);

        // Simplified Tax Slabs for Demonstration
        const taxBrackets = {
            US: [
                { upTo: 11000, rate: 0.10 },
                { upTo: 44725, rate: 0.12 },
                { upTo: 95375, rate: 0.22 },
                { upTo: 182100, rate: 0.24 },
                { upTo: Infinity, rate: 0.32 },
            ],
            UK: [
                { upTo: 12570, rate: 0.0 },
                { upTo: 50270, rate: 0.20 },
                { upTo: 125140, rate: 0.40 },
                { upTo: Infinity, rate: 0.45 },
            ],
            AUS: [
                { upTo: 18200, rate: 0.0 },
                { upTo: 45000, rate: 0.19 },
                { upTo: 120000, rate: 0.325 },
                { upTo: 180000, rate: 0.37 },
                { upTo: Infinity, rate: 0.45 },
            ],
            India: [
                { upTo: 300000, rate: 0.0 },
                { upTo: 600000, rate: 0.05 },
                { upTo: 900000, rate: 0.10 },
                { upTo: 1200000, rate: 0.15 },
                { upTo: 1500000, rate: 0.20 },
                { upTo: Infinity, rate: 0.30 },
            ]
        };

        const brackets = taxBrackets[region] || taxBrackets.US;

        let estimatedTax = 0;
        let remainingIncome = netIncome;
        let previousLimit = 0;

        for (const b of brackets) {
            const taxableAtThisRate = Math.min(Math.max(0, b.upTo - previousLimit), remainingIncome);
            if (taxableAtThisRate > 0) {
                estimatedTax += taxableAtThisRate * b.rate;
                remainingIncome -= taxableAtThisRate;
            }
            previousLimit = b.upTo;
            if (remainingIncome <= 0) break;
        }

        // Determine current quarter
        const month = new Date().getMonth();
        let currentQuarter = 'Q1';
        if (month >= 3 && month <= 5) currentQuarter = 'Q2';
        else if (month >= 6 && month <= 8) currentQuarter = 'Q3';
        else if (month >= 9) currentQuarter = 'Q4';

        // The estimate is for the whole year, but let's save what they owe per quarter approx
        // Usually it's estimatedTax / 4
        const quarterlyTax = estimatedTax / 4;

        res.json({
            success: true,
            data: {
                income,
                expenses,
                netIncome,
                estimatedTax,
                quarterlyTax,
                currentQuarter,
                region,
                year: currentYear
            }
        });

    } catch (error) {
        console.error('Tax estimation error:', error);
        res.status(500).json({ success: false, message: 'Server error during tax estimation' });
    }
};

exports.saveEstimate = async (req, res) => {
    try {
        const { quarter, estimated_tax, year } = req.body;
        const currentYear = year || new Date().getFullYear();

        // Upsert the estimate for this quarter/year
        const estimate = await TaxEstimate.findOneAndUpdate(
            { user_id: req.user, quarter, year: currentYear },
            { estimated_tax },
            { new: true, upsert: true }
        );

        res.json({ success: true, data: estimate });
    } catch (error) {
        console.error('Save estimate error:', error);
        res.status(500).json({ success: false, message: 'Server error saving estimate' });
    }
};

exports.getEstimates = async (req, res) => {
    try {
        const estimates = await TaxEstimate.find({ user_id: req.user }).sort({ year: -1, quarter: 1 });
        res.json({ success: true, count: estimates.length, data: estimates });
    } catch (error) {
        console.error('Get estimates error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching estimates' });
    }
};
