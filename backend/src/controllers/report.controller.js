const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const Report = require('../models/report.model');
const Transaction = require('../models/transaction.model');

exports.generateReport = async (req, res) => {
    try {
        const { report_type, period, format } = req.body; // format: 'PDF' or 'CSV'

        let startDate, endDate;
        const now = new Date();

        // Parse period (very basic parsing for demonstration)
        if (period === 'Current Month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        } else {
            // just default to this year if can't parse
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        }

        const transactions = await Transaction.find({
            user_id: req.user,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 });

        const fileName = `report-${req.user}-${Date.now()}.${format.toLowerCase()}`;
        const reportsDir = path.join(__dirname, '../../public/reports');

        // Ensure dir exists (already done by script, but good practice)
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const filePath = path.join(reportsDir, fileName);
        const fileUrl = `/reports/${fileName}`;

        if (format === 'CSV') {
            const fields = ['date', 'type', 'category', 'amount'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(transactions.map(t => ({
                date: new Date(t.date).toLocaleDateString(),
                type: t.type,
                category: t.category,
                amount: t.amount
            })));
            fs.writeFileSync(filePath, csv);

        } else if (format === 'PDF') {
            const doc = new PDFDocument({ margin: 50 });
            doc.pipe(fs.createWriteStream(filePath));

            doc.fontSize(20).text('TaxPal Financial Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Report Type: ${report_type}`);
            doc.text(`Period: ${period}`);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`);
            doc.moveDown();

            let totalIncome = 0;
            let totalExpense = 0;

            transactions.forEach(t => {
                if (t.type === 'income') totalIncome += t.amount;
                if (t.type === 'expense') totalExpense += t.amount;
            });

            doc.fontSize(16).text('Summary', { underline: true });
            doc.fontSize(12).text(`Total Income: $${totalIncome.toFixed(2)}`);
            doc.text(`Total Expenses: $${totalExpense.toFixed(2)}`);
            doc.text(`Net: $${(totalIncome - totalExpense).toFixed(2)}`);
            doc.moveDown();

            doc.fontSize(16).text('Transactions', { underline: true });
            doc.moveDown();

            transactions.forEach(t => {
                const tDate = new Date(t.date).toLocaleDateString();
                const tAmount = t.type === 'income' ? `+$${t.amount}` : `-$${t.amount}`;
                doc.fontSize(10).text(`${tDate} | ${t.category} | ${tAmount}`);
            });

            doc.end();
        }

        // Delay saving to DB to ensure file is written or just save it immediately
        const report = await Report.create({
            user_id: req.user,
            period,
            report_type,
            file_path: fileUrl
        });

        res.json({ success: true, data: report });

    } catch (error) {
        console.error('Generate report error:', error);
        res.status(500).json({ success: false, message: 'Server error generating report' });
    }
};

exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find({ user_id: req.user }).sort({ createdAt: -1 });
        res.json({ success: true, count: reports.length, data: reports });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching reports' });
    }
};
