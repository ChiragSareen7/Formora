import React from 'react';
import BarChart from '../../charts/BarChart03';
import { getCssVariable } from '../../utils/Utils';

function Reason({ data }) {
  if (!data || !data.reasons) return <div className="text-center text-gray-500">No refund data available.</div>;

  const chartData = {
    labels: ["Reasons"],
    datasets: data.reasons.map((reason) => ({
      label: reason.label,
      data: [reason.count],
      backgroundColor: getCssVariable("--color-blue-400"), // Example color
      barPercentage: 1,
      categoryPercentage: 1,
    })),
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Reason for Refunds</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            {data.totalRefunds}
          </div>
          <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">
            -{data.refundRate}%
          </div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        <BarChart data={chartData} width={595} height={48} />
      </div>
    </div>
  );
}

export default Reason;
