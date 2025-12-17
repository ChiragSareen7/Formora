import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { TrendingUp, ArrowLeft, Loader2, BarChart3, Sparkles, Target, Lightbulb } from 'lucide-react';
import { buildApiUrl } from '../config/api';

const FormStrategy = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStrategy();
  }, [formId]);

  const fetchStrategy = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl(`/api/ai-forms/${formId}/strategy`));
      if (response.data.success) {
        setData(response.data);
      } else {
        setError(response.data.message || 'Failed to load strategy');
      }
    } catch (err) {
      console.error('Error fetching strategy:', err);
      setError('Failed to load strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
          </main>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Failed to load strategy'}</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!data.strategy) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No Strategy Available Yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {data.message || 'Strategy will be available after receiving form responses.'}
                </p>
                <button
                  onClick={() => navigate(`/form/${formId}/reports`)}
                  className="bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                >
                  View Reports
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const strategy = data.strategy;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="grow bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">
                    {data.form.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    AI-Powered Business Strategy
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/form/${formId}/reports`)}
                    className="bg-purple-600 dark:bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Reports
                  </button>
                </div>
              </div>
            </div>

            {/* Strategy Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Strategy Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Summary Section */}
                {strategy.summary && (
                  <>
                    {/* Key Insights */}
                    {strategy.summary.keyInsights && (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Key Insights</h2>
                        </div>
                        {Array.isArray(strategy.summary.keyInsights) ? (
                          <ul className="space-y-3">
                            {strategy.summary.keyInsights.map((insight, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                                <span className="text-gray-700 dark:text-gray-300">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300">{strategy.summary.keyInsights}</p>
                        )}
                      </div>
                    )}

                    {/* Product Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {strategy.summary.productStrengths && strategy.summary.productStrengths.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Strengths</h3>
                          <ul className="space-y-2">
                            {strategy.summary.productStrengths.map((strength, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {strategy.summary.productWeaknesses && strategy.summary.productWeaknesses.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Areas for Improvement</h3>
                          <ul className="space-y-2">
                            {strategy.summary.productWeaknesses.map((weakness, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                                <span className="text-gray-700 dark:text-gray-300">{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Customer Sentiment */}
                    {strategy.summary.customerSentiment && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Customer Sentiment</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                          {strategy.summary.customerSentiment}
                        </p>
                      </div>
                    )}

                    {/* Priority Areas */}
                    {strategy.summary.priorityAreas && strategy.summary.priorityAreas.length > 0 && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Priority Areas</h3>
                        <ul className="space-y-2">
                          {strategy.summary.priorityAreas.map((area, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-orange-600 dark:text-orange-400 mt-1">🔴</span>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {/* Fallback: Direct keyInsights if summary doesn't exist */}
                {!strategy.summary && strategy.keyInsights && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Key Insights</h2>
                    </div>
                    {Array.isArray(strategy.keyInsights) ? (
                      <ul className="space-y-3">
                        {strategy.keyInsights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">{strategy.keyInsights}</p>
                    )}
                  </div>
                )}

                {/* Recommendations */}
                {(strategy.summary?.recommendations || strategy.recommendations) && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-blue-500" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recommendations</h2>
                    </div>
                    {Array.isArray(strategy.summary?.recommendations || strategy.recommendations) ? (
                      <ul className="space-y-3">
                        {(strategy.summary?.recommendations || strategy.recommendations).map((rec, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">{strategy.summary?.recommendations || strategy.recommendations}</p>
                    )}
                  </div>
                )}

                {/* Action Items */}
                {(strategy.summary?.actionItems || strategy.actionItems) && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Action Items</h2>
                    </div>
                    {Array.isArray(strategy.summary?.actionItems || strategy.actionItems) ? (
                      <ul className="space-y-3">
                        {(strategy.summary?.actionItems || strategy.actionItems).map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">{strategy.summary?.actionItems || strategy.actionItems}</p>
                    )}
                  </div>
                )}

                {/* Strategy Cards */}
                {data.strategies && data.strategies.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Strategic Initiatives</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.strategies.map((strat) => (
                        <div key={strat.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{strat.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${
                              strat.status === 'ACTIVE' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}>
                              {strat.status}
                            </span>
                          </div>
                          {strat.actions && strat.actions.length > 0 && (
                            <ul className="space-y-2">
                              {strat.actions.map((action, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" checked={action.completed} readOnly className="accent-purple-600" />
                                  <span className={action.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}>
                                    {action.description}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* General Summary */}
                {strategy.summary && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Summary</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {typeof strategy.summary === 'string' ? strategy.summary : JSON.stringify(strategy.summary)}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Form Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Form Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">{data.form.title}</p>
                    </div>
                    {data.form.description && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                        <p className="text-gray-900 dark:text-gray-100">{data.form.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/form/${formId}/reports`)}
                      className="w-full bg-purple-600 dark:bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Reports
                    </button>
                    <button
                      onClick={() => navigate(`/ai-form/${formId}`)}
                      className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      View Form
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormStrategy;

