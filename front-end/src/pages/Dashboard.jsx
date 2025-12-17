import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { Sparkles, BarChart3, TrendingUp, Eye, Loader2 } from 'lucide-react';
import { buildApiUrl } from '../config/api';

import dashboardDataJSON from '../partials/dashboard/dashboardData.json';

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData] = useState(dashboardDataJSON);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get(buildApiUrl('/api/ai-forms'));
      if (response.data.success) {
        setForms(response.data.forms || []);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content Area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
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
                <button
                  onClick={() => navigate('/ai-form-creation')}
                  className="btn bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="hidden sm:inline">AI Form Creator</span>
                  <span className="sm:hidden">AI</span>
                </button>
                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                  <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="max-xs:sr-only">Add View</span>
                </button>
              </div>
            </div>

            {/* My Forms Section */}
            <div className="mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Forms</h2>
                  <button
                    onClick={() => navigate('/ai-form-creation')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Create New Form</span>
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600 dark:text-purple-400" />
                  </div>
                ) : forms.length === 0 ? (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No forms created yet</p>
                    <button
                      onClick={() => navigate('/ai-form-creation')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                    >
                      Create Your First Form
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {forms.map((form) => (
                      <div
                        key={form.formId}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{form.title}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(form.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        {form.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {form.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {form.initialQuestions?.length || 0} questions
                          </span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/form/${form.formId}/reports`);
                            }}
                            className="flex-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <BarChart3 className="w-4 h-4" />
                            Reports
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/form/${form.formId}/strategy`);
                            }}
                            className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <TrendingUp className="w-4 h-4" />
                            Strategy
                          </button>
                        </div>
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/ai-form/${form.formId}`);
                            }}
                            className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                          >
                            View Form →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Analytics Cards */}
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
