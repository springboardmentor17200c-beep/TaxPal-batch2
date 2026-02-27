import { useState, useEffect } from "react";
import axios from "axios";

function TaxCalculator() {
  const [income, setIncome] = useState("");
  const [country, setCountry] = useState("India");
  const [tax, setTax] = useState(null);
  const [quarterDates, setQuarterDates] = useState([]);

  // Fetch Quarterly Dates
  useEffect(() => {
    const fetchQuarterlyDates = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/tax/quarterly-dates"
        );
        setQuarterDates(res.data.data);
      } catch (error) {
        console.error("Error fetching quarterly dates", error);
      }
    };

    fetchQuarterlyDates();
  }, []);

  // Calculate Tax
  const handleCalculate = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/tax/calculate",
        {
          country,
          income: Number(income),
        }
      );

      setTax(res.data.estimatedTax);
    } catch (error) {
      console.error("Tax calculation error", error);
    }
  };

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">Tax Calculator</h2>

      {/* Calculator Card */}
      <div className="bg-slate-800 p-6 rounded-xl w-[400px] mb-8">
        <label className="block mb-2">Select Country</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-slate-900"
        >
          <option>India</option>
          <option>USA</option>
          <option>UK</option>
        </select>

        <label className="block mb-2">Enter Annual Income</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-slate-900"
        />

        <button
          onClick={handleCalculate}
          className="bg-purple-600 hover:bg-purple-700 w-full p-2 rounded"
        >
          Calculate
        </button>

        {tax !== null && (
          <p className="mt-4 font-bold text-lg">
            Estimated Tax: ₹{tax}
          </p>
        )}
      </div>

      {/* Quarterly Due Dates */}
      <div className="bg-slate-800 p-6 rounded-xl w-[400px]">
        <h3 className="text-xl font-semibold mb-4">
          Quarterly Tax Due Dates
        </h3>

        {quarterDates.map((item, index) => (
          <div
            key={index}
            className="flex justify-between border-b border-slate-600 py-2"
          >
            <span>{item.quarter}</span>
            <span>{item.dueDate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaxCalculator;