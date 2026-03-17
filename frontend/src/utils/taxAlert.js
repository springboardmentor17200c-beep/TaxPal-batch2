export const getQuarterlyTaxStatus = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Define deadlines
    const deadlines = [
        { quarter: 'Q1', date: new Date(currentYear, 3, 15) }, // April 15
        { quarter: 'Q2', date: new Date(currentYear, 5, 15) }, // June 15
        { quarter: 'Q3', date: new Date(currentYear, 8, 15) }, // September 15
        { quarter: 'Q4', date: new Date(currentYear + 1, 0, 15) } // January 15 next year
    ];

    // Find the current or nearest upcoming deadline
    // We want the first deadline that is "active"
    // If today is Jan 20, Q4 of previous year is missed? 
    // Actually, usually users care about the NEXT one.
    
    let target = null;
    for (const d of deadlines) {
        // We include deadlines that just passed slightly (within 7 days) to show "Missed"
        const diffDays = Math.ceil((d.date - now) / (1000 * 60 * 60 * 24));
        if (diffDays >= -7) {
            target = { ...d, daysLeft: diffDays };
            break;
        }
    }

    if (!target) {
        // Fallback to Q1 of next year if somehow we passed everything
        target = { quarter: 'Q1', date: new Date(currentYear + 1, 3, 15), daysLeft: 100 };
    }

    let status = 'safe';
    let message = '';

    if (target.daysLeft > 5) {
        status = 'safe';
        message = `${target.daysLeft} days left to pay your ${target.quarter} tax`;
    } else if (target.daysLeft <= 5 && target.daysLeft > 0) {
        status = 'urgent';
        message = `⚠️ Hurry! Only ${target.daysLeft} days left for ${target.quarter} tax payment`;
    } else if (target.daysLeft === 0) {
        status = 'due';
        message = `🚨 Tax payment is due TODAY for ${target.quarter}`;
    } else {
        status = 'missed';
        message = `❌ Tax deadline missed for ${target.quarter}`;
    }

    return {
        ...target,
        status,
        message,
        dueDate: target.date.toISOString()
    };
};
