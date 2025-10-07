import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import PositiveResponse from '../partials/dashboard/PositiveResponse';
import NegativeResponse from '../partials/dashboard/NegativeResponse';
import ResponseTrend from '../partials/dashboard/ResponseTrend';
import Sentiment from '../partials/dashboard/Sentiment';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import SalesRefund from '../partials/dashboard/SalesRefund';
import Reason from '../partials/dashboard/Reason';
import Recent from '../partials/dashboard/Recent';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import Customers from '../partials/dashboard/Customers';
import DashboardCard13 from '../partials/dashboard/DashboardCard13';

import dashboardDataJSON from '../partials/dashboard/dashboardData.json';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData] = useState(dashboardDataJSON); // Directly using imported JSON

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content Area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard Actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Dashboard
                </h1>
              </div>
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <FilterButton align="right" />
                <Datepicker align="right" />
                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                  <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="max-xs:sr-only">Add View</span>
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {/* Positive & Negative Response Side-by-Side */}
              <div className="col-span-6 p-4 bg-white dark:bg-gray-800 shadow-2xl rounded-lg">
                <PositiveResponse data={dashboardData.positiveResponses} />
              </div>
              <div className="col-span-6 p-4 bg-white dark:bg-gray-800 shadow-2xl rounded-lg">
                <NegativeResponse data={dashboardData.negativeResponses} />
              </div>

              {/* Other Dashboard Components with Shadows */}
              <div className="col-span-12 p-4 bg-white dark:bg-gray-800 shadow-2xl rounded-lg">
                <Recent 
                  feedbacks={dashboardData.recentActivity?.feedbacks || []} 
                  highPriority={dashboardData.recentActivity?.highPriority || []} 
                />
              </div>

              <div className="col-span-6 p-4 bg-white dark:bg-gray-800 shadow-2xl rounded-lg">
                <ResponseTrend data={dashboardData.responseTrend} />
              </div>
              <div className="col-span-6 p-4 bg-white dark:bg-gray-800 shadow-2xl rounded-lg">
                <Sentiment data={dashboardData.sentiment} />
              </div>

              <div className="col-span-6 p-4 bg-white dark:bg-gray-800 shadow-2xl rounded-lg">
                <SalesRefund data={dashboardData.salesRefund || {}} />
              </div>
              <div className="col-span-6 p-4 bg-white dark:bg-gray-800 shadow-2xl rounded-lg">
                <Reason data={dashboardData.reasons || {}} />
              </div>

              <div className="col-span-12 p-4 bg-white dark:bg-gray-800 shadow-2xl rounded-lg">
                <Customers customers={dashboardData.customers || []} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
