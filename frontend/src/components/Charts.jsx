// src/components/Charts.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: 'rgba(255,255,255,0.1)',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
    y: {
      grid: {
        color: 'rgba(255,255,255,0.1)',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#9CA3AF',
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
  },
};

export function IncomeExpenseChart({ monthlyData }) {
  const data = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: monthlyData?.income || Array(12).fill(0),
        backgroundColor: 'rgba(34, 197, 94, 0.3)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: monthlyData?.expenses || Array(12).fill(0),
        backgroundColor: 'rgba(239, 68, 68, 0.3)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }), [monthlyData]);

  return <Bar data={data} options={barOptions} />;
}

export function ExpenseBreakdownChart({ breakdownData }) {
  const data = useMemo(() => ({
    labels: breakdownData?.map(item => item.category) || [],
    datasets: [
      {
        data: breakdownData?.map(item => item.amount) || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.3)',
          'rgba(59, 130, 246, 0.3)',
          'rgba(147, 51, 234, 0.3)',
          'rgba(236, 72, 153, 0.3)',
          'rgba(245, 158, 11, 0.3)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(59, 130, 246)',
          'rgb(147, 51, 234)',
          'rgb(236, 72, 153)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 1,
      },
    ],
  }), [breakdownData]);

  return <Pie data={data} options={pieOptions} />;
}