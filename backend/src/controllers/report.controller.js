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

        // Parse period
        if (period === 'Current Month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        } else if (period === 'Last Month') {
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        } else if (period.startsWith('Q')) {
            const quarter = parseInt(period[1]);
            startDate = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
            endDate = new Date(now.getFullYear(), quarter * 3, 0, 23, 59, 59);
        } else if (period === 'Year to Date') {
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        } else {
            // Default to current year
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        }

        const transactions = await Transaction.find({
            user: req.user,
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
            const fields = [
                { label: 'Transaction Date', value: 'date' },
                { label: 'Record Type', value: 'type' },
                { label: 'Category', value: 'category' },
                { label: 'Amount ($)', value: 'amount' },
                { label: 'Description', value: 'description' },
                { label: 'Notes', value: 'notes' },
                { label: 'Recorded At', value: 'createdAt' }
            ];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(transactions.map(t => ({
                date: new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                type: t.type.toUpperCase(),
                category: t.category,
                amount: t.type === 'expense' ? `-${t.amount.toFixed(2)}` : `${t.amount.toFixed(2)}`,
                description: t.description || 'N/A',
                notes: t.notes || 'N/A',
                createdAt: new Date(t.createdAt).toLocaleString('en-US')
            })));
            fs.writeFileSync(filePath, csv);

        } else if (format === 'PDF') {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // --- Header & Branding ---
            doc.rect(0, 0, 595.28, 80).fill('#4f46e5'); // Indigo header bar
            doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('TaxPal', 50, 25);
            doc.fontSize(10).font('Helvetica').text('Smart Financial Intelligence', 50, 52);
            doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, 450, 35, { align: 'right' });

            doc.fillColor('#000000').moveDown(4);

            // --- Report Info ---
            doc.fontSize(18).font('Helvetica-Bold').text(report_type, 50, 100);
            doc.fontSize(12).font('Helvetica').text(`Period: ${period}`, 50, 125);
            doc.rect(50, 140, 495, 1).fill('#e2e8f0'); // Divider

            // --- Summary Section ---
            let totalIncome = 0;
            let totalExpense = 0;
            transactions.forEach(t => {
                if (t.type === 'income') totalIncome += t.amount;
                if (t.type === 'expense') totalExpense += t.amount;
            });

            doc.moveDown(3);
            doc.fontSize(14).font('Helvetica-Bold').text('Financial Summary', 50, 160);

            // Financial Cards (Shaded Rects)
            const cardWidth = 155;
            const cardHeight = 60;
            const cardY = 185;

            // Income Card
            doc.roundedRect(50, cardY, cardWidth, cardHeight, 8).fill('#f0fdf4');
            doc.fillColor('#166534').fontSize(10).text('TOTAL INCOME', 60, cardY + 15);
            doc.fontSize(14).font('Helvetica-Bold').text(`$${totalIncome.toLocaleString()}`, 60, cardY + 32);

            // Expense Card
            doc.roundedRect(220, cardY, cardWidth, cardHeight, 8).fill('#fef2f2');
            doc.fillColor('#991b1b').fontSize(10).text('TOTAL EXPENSES', 230, cardY + 15);
            doc.fontSize(14).font('Helvetica-Bold').text(`$${totalExpense.toLocaleString()}`, 230, cardY + 32);

            // Net Card
            const isNegative = (totalIncome - totalExpense) < 0;
            doc.roundedRect(390, cardY, cardWidth, cardHeight, 8).fill(isNegative ? '#fff7ed' : '#f5f3ff');
            doc.fillColor(isNegative ? '#9a3412' : '#5b21b6').fontSize(10).text('NET SAVINGS', 400, cardY + 15);
            doc.fontSize(14).font('Helvetica-Bold').text(`$${(totalIncome - totalExpense).toLocaleString()}`, 400, cardY + 32);

            doc.fillColor('#000000').moveDown(6);

            // --- Transactions Table ---
            const tableTop = 280;
            doc.fontSize(14).font('Helvetica-Bold').text('Detailed Transactions', 50, tableTop - 25);

            // Table Header
            doc.rect(50, tableTop, 495, 25).fill('#f8fafc');
            doc.fillColor('#64748b').fontSize(10).font('Helvetica-Bold');
            doc.text('DATE', 60, tableTop + 8);
            doc.text('CATEGORY', 150, tableTop + 8);
            doc.text('TYPE', 300, tableTop + 8);
            doc.text('AMOUNT', 450, tableTop + 8, { align: 'right' });

            let y = tableTop + 35;
            doc.fillColor('#1e293b').font('Helvetica');

            transactions.forEach((t, i) => {
                if (y > 750) { // Page break logic
                    doc.addPage();
                    y = 50;
                }

                const tDate = new Date(t.date).toLocaleDateString();
                const tAmount = t.type === 'income' ? `+$${t.amount.toLocaleString()}` : `-$${t.amount.toLocaleString()}`;
                const amountColor = t.type === 'income' ? '#16a34a' : '#dc2626';

                doc.fontSize(9).fillColor('#1e293b').text(tDate, 60, y);
                doc.text(t.category, 150, y);
                doc.text(t.type.toUpperCase(), 300, y);
                doc.fillColor(amountColor).text(tAmount, 450, y, { width: 95, align: 'right' });

                // Row separator
                doc.fillColor('#f1f5f9').rect(50, y + 15, 495, 0.5).fill();
                y += 30;
            });

            // --- Footer ---
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                doc.fillColor('#94a3b8').fontSize(8).text(
                    `Page ${i + 1} of ${pageCount} | TaxPal confidential report`,
                    50,
                    800,
                    { align: 'center' }
                );
            }

            doc.end();

            await new Promise((resolve, reject) => {
                stream.on('finish', resolve);
                stream.on('error', reject);
            });
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
