import React from 'react';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function NegativeResponse({ data }) {
  // Ensure data is valid to prevent crashes
  const negativeResponses = data?.negativeResponses || [];
  const percentageChange = data?.percentageChange || 0;
  const totalNegative = data?.totalNegative || 0;

  // Check if there's valid data
  const hasData = negativeResponses.length > 0;

  // Chart Data (Dynamic)
  const chartData = hasData
    ? {
        labels: negativeResponses.map((item) => item.date),
        datasets: [
          {
            data: negativeResponses.map((item) => item.value),
            fill: true,
            backgroundColor: function (context) {
              const { ctx, chartArea } = context.chart;
              return chartAreaGradient(ctx, chartArea, [
                { stop: 0, color: adjustColorOpacity(getCssVariable('--color-red-500'), 0) },
                { stop: 1, color: adjustColorOpacity(getCssVariable('--color-red-500'), 0.2) }
              ]);
            },
            borderColor: getCssVariable('--color-red-500'),
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: getCssVariable('--color-red-500'),
            pointHoverBackgroundColor: getCssVariable('--color-red-500'),
            clip: 20,
            tension: 0.2
          }
        ]
      }
    : null;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Negative Response</h2>
        </header>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            {hasData ? totalNegative.toLocaleString() : 'N/A'}
          </div>
          {hasData ? (
            <div className={`text-sm font-medium px-1.5 rounded-full ${
              percentageChange < 0 ? 'text-red-700 bg-red-500/20' : 'text-green-700 bg-green-500/20'
            }`}>
              {percentageChange}%
            </div>
          ) : (
            <div className="text-sm text-gray-500">No data</div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="grow max-sm:max-h-[128px] max-h-[128px]">
        {hasData ? (
          <LineChart data={chartData} width={389} height={128} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">No data available</div>
        )}
      </div>
    </div>
  );
}

export default NegativeResponse;
