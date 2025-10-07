import React, { useEffect } from 'react';
import LineChart from '../../charts/LineChart01';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';
import { chartAreaGradient } from '../../charts/ChartjsConfig';

function PositiveResponse({ data }) {
  if (!data || !data.chartData) {
    return (
      <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Positive Response</h2>
        <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
      </div>
    );
  }

  // Ensure data is valid
  const labels = Array.isArray(data.chartData.labels) ? data.chartData.labels : [];
  const values = Array.isArray(data.chartData.values) ? data.chartData.values : [];

  // Create chartData with new structure
  const chartData = {
    labels: [     "1",     "2",     "3",     "4",],
    datasets: [
      {
        data: values,
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-green-500'), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-green-500'), 0.2) }
          ]);
        },            
        borderColor: getCssVariable('--color-green-500'),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-green-500'),
        pointHoverBackgroundColor: getCssVariable('--color-green-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Positive Response</h2>
        </header>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            {data.total ?? '0'}
          </div>
          <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">
            {data.percentageChange ?? '0%'}
          </div>
        </div>
      </div>
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default PositiveResponse;