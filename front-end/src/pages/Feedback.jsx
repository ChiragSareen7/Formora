import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import { StrategyCard, MetricCard, AnalyzedPoint, TaskItem } from '../partials/FeedbackCards';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard13 from '../partials/dashboard/DashboardCard13';

import feedbackData from '../partials/feedbackData.json';

function FeedbackDashboard() {
 const [sidebarOpen, setSidebarOpen] = useState(false);

 return (
  <div className="flex h-screen overflow-hidden bg-gray-100">
   {/* Sidebar */}
   <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

   {/* Content area */}
   <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
    {/* Site header */}
    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

    <main className="grow">
     <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Dashboard actions */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
       <div className="mb-4 sm:mb-0">
        <h1 className="text-3xl text-gray-800 font-bold tracking-wide">
         📊 Feedback Dashboard
        </h1>
       </div>

       <div className="flex gap-3">
        <FilterButton align="right" />
        <Datepicker align="right" />
       </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
       {/* Strategy Cards */}
       {feedbackData.strategies.map((strategy) => (
        <div className="col-span-4" key={strategy.id}>
         <StrategyCard {...strategy} />
        </div>
       ))}

       {/* Business Strategy Section */}
       <div className="col-span-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🚀 Business Strategy</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
         {feedbackData.metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
         ))}
        </div>

        <h3 className="font-semibold text-gray-600 mb-4">🔎 Analyzed Points</h3>
        <div className="space-y-4">
         {feedbackData.analyzedPoints.map((point, index) => (
          <AnalyzedPoint key={index} {...point} />
         ))}
        </div>
       </div>

       {/* Automated Follow-Ups */}
       <div className="col-span-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📩 Automated Follow-Ups</h2>
        <div className="space-y-4">
         {feedbackData.tasks.map((task, index) => (
          <TaskItem key={index} {...task} />
         ))}
        </div>
       </div>

       {/* Sales Over Time & Top Channels Side by Side */}
       <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5">
         <DashboardCard08 />
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5">
         <DashboardCard07 />
        </div>
       </div>

      </div>
     </div>
    </main>
   </div>
  </div>
 );
}

export default FeedbackDashboard;
