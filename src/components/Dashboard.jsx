import React from 'react';
import KPICard from './KPICard';
import ReportChart from './ReportChart';
import ForecastTable from './ForecastTable';
import { CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

// Mock Data
const kpiData = {
  totalRevenue: { title: 'Total Revenue', value: '$482,591' },
  avgSales: { title: 'Average Sale Value', value: '$1,245' }
};

const salesTrendData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales',
      data: [6500, 5900, 8000, 8100, 5600, 5500, 7200],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

const forecastData = [
  { period: 'Next 3 Months', predictedValue: '$155,000', confidenceRange: '$140k - $170k' },
  { period: 'Next 6 Months', predictedValue: '$320,000', confidenceRange: '$290k - $350k' },
  { period: 'Next 12 Months', predictedValue: '$650,000', confidenceRange: '$590k - $710k' },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Business Dashboard</h2>
        <p className="text-slate-600 mt-2">Your key metrics and growth predictions</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KPICard
          title={kpiData.totalRevenue.title}
          value={kpiData.totalRevenue.value}
          icon={<CurrencyDollarIcon className="h-8 w-8 text-green-500" />}
        />
        <KPICard
          title={kpiData.avgSales.title}
          value={kpiData.avgSales.value}
          icon={<ShoppingCartIcon className="h-8 w-8 text-blue-500" />}
        />
      </div>

      {/* Sales Trend Chart */}
      <div className="grid grid-cols-1">
        <ReportChart title="Sales Trend Over Time" chartData={salesTrendData} />
      </div>

      {/* Forecast Table */}
      <div className="grid grid-cols-1">
        <ForecastTable data={forecastData} />
      </div>
    </div>
  );
}

export default Dashboard;
