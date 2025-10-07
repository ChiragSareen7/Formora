import React, { useState, useEffect } from 'react';
import RealtimeChart from '../../charts/RealtimeChart';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function ResponseTrend({ data }) {

  const trendData = data?.trendData || [];

  const formattedTrendData = trendData.map(item => ({
    date: new Date(item.date),
    value: item.value
  }));

  const initialRange = 35;
  const [slicedData, setSlicedData] = useState([]);
  const [slicedLabels, setSlicedLabels] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (formattedTrendData.length > 0) {
      setSlicedData(formattedTrendData.slice(0, initialRange).map(item => item.value));
      setSlicedLabels(formattedTrendData.slice(0, initialRange).map(item => item.date));
    }
  }, [data]); 


  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prevCounter => prevCounter + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (formattedTrendData.length > initialRange) {
      setSlicedData(prev => [...prev.slice(1), formattedTrendData[initialRange + counter]?.value || prev[prev.length - 1]]);
      setSlicedLabels(prev => [...prev.slice(1), new Date()]);
    }
  }, [counter, formattedTrendData]);

  // Chart Data
  const chartData = {
    labels: slicedLabels,
    datasets: [
      {
        data: slicedData,
        fill: true,
        backgroundColor: function(context) {
          const { ctx, chartArea } = context.chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) }
          ]);
        },
        borderColor: getCssVariable('--color-violet-500'),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-violet-500'),
        pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
        clip: 20,
        tension: 0.2
      }
    ]
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Response Trend</h2>
      </header>
      {/* Chart */}
      <RealtimeChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default ResponseTrend;
