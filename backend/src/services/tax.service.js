// backend/src/services/tax.service.js

// TAX CALCULATION LOGIC
const calculateTax = (country, income) => {
  let tax = 0;

  if (country === "India") {
    if (income <= 250000) {
      tax = 0;
    } 
    else if (income <= 500000) {
      tax = (income - 250000) * 0.05;
    } 
    else if (income <= 1000000) {
      tax =
        (250000 * 0.05) +
        (income - 500000) * 0.2;
    } 
    else {
      tax =
        (250000 * 0.05) +
        (500000 * 0.2) +
        (income - 1000000) * 0.3;
    }
  }

  else if (country === "USA") {
    tax = income * 0.22;
  }

  else if (country === "UK") {
    tax = income * 0.25;
  }

  return Math.round(tax);
};

// QUARTERLY DUE DATES
const getQuarterlyDates = () => {
  return [
    { quarter: "Q1", dueDate: "15 June" },
    { quarter: "Q2", dueDate: "15 September" },
    { quarter: "Q3", dueDate: "15 December" },
    { quarter: "Q4", dueDate: "15 March" },
  ];
};

module.exports = {
  calculateTax,
  getQuarterlyDates,
};