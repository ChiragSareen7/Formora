import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { BarChart3, ArrowLeft, Loader2, TrendingUp, Users, FileText, Sparkles, Brain, Target, Lightbulb } from 'lucide-react';
import { buildApiUrl } from '../config/api';

const FormReports = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatingAIReport, setGeneratingAIReport] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, [formId]);

  const fetchReports = async (includeAIReport = false) => {
    try {
      setLoading(true);
      const url = `${buildApiUrl(`/api/ai-forms/${formId}/submissions`)}${includeAIReport ? '?aiReport=true' : ''}`;
      const response = await axios.get(url);
      if (response.data.success) {
        setData(response.data);
      } else {
        setError(response.data.message || 'Failed to load reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
      setGeneratingAIReport(false);
    }
  };

  const generateAIReport = async () => {
    setGeneratingAIReport(true);
    await fetchReports(true);
  };

  const calculateStats = (responses) => {
    if (!responses || responses.length === 0) return { total: 0, distribution: {} };
    
    const distribution = {};
    responses.forEach(response => {
      const key = String(response);
      distribution[key] = (distribution[key] || 0) + 1;
    });

    return {
      total: responses.length,
      distribution
    };
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
              <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Failed to load reports'}</p>
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
                    Form Reports & Analytics
                  </p>
                </div>
                <div className="flex gap-3">
                  {data.analytics.totalSubmissions > 0 && !data.aiReport && (
                    <button
                      onClick={generateAIReport}
                      disabled={generatingAIReport}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {generatingAIReport ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating AI Report...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate AI Report
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/form/${formId}/strategy`)}
                    className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    View Strategy
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Submissions</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {data.analytics.totalSubmissions}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Questions</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {Object.keys(data.analytics.questionAnalytics).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Created</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {new Date(data.form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI-Powered Report */}
            {data.aiReport && !data.aiReport.error && (
              <div className="mb-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    AI-Powered Report
                  </h2>
                  <button
                    onClick={generateAIReport}
                    disabled={generatingAIReport}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline disabled:opacity-50"
                  >
                    {generatingAIReport ? 'Regenerating...' : 'Regenerate Report'}
                  </button>
                </div>

                {/* Executive Summary */}
                {data.aiReport.executiveSummary && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Executive Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Overall Sentiment</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                          {data.aiReport.executiveSummary.overallSentiment || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {data.aiReport.executiveSummary.totalSubmissions || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                          {data.aiReport.executiveSummary.responseRate || 'N/A'}
                        </p>
                      </div>
                    </div>
                    {data.aiReport.executiveSummary.keyFindings && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Findings:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {data.aiReport.executiveSummary.keyFindings.map((finding, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">{finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Sentiment Analysis */}
                {data.aiReport.sentimentAnalysis && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sentiment Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['positive', 'negative', 'neutral'].map((sentiment) => {
                        const sentimentData = data.aiReport.sentimentAnalysis[sentiment];
                        if (!sentimentData) return null;
                        return (
                          <div key={sentiment} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize mb-2">{sentiment}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                              {sentimentData.count || 0}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {sentimentData.percentage || 0}%
                            </p>
                            {sentimentData.examples && sentimentData.examples.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Examples:</p>
                                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                  {sentimentData.examples.slice(0, 2).map((example, idx) => (
                                    <li key={idx} className="truncate">• {example}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Key Insights */}
                {data.aiReport.keyInsights && data.aiReport.keyInsights.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Key Insights
                    </h3>
                    <div className="space-y-4">
                      {data.aiReport.keyInsights.map((insight, idx) => (
                        <div key={idx} className="border-l-4 border-purple-500 dark:border-purple-400 pl-4 py-2">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{insight.insight || insight}</p>
                          {typeof insight === 'object' && (
                            <div className="mt-2 flex gap-2">
                              {insight.category && (
                                <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                                  {insight.category}
                                </span>
                              )}
                              {insight.impact && (
                                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                  {insight.impact} impact
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.aiReport.strengths && data.aiReport.strengths.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Strengths</h3>
                      <ul className="space-y-2">
                        {data.aiReport.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                            <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.aiReport.improvements && data.aiReport.improvements.length > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Areas for Improvement</h3>
                      <ul className="space-y-2">
                        {data.aiReport.improvements.map((improvement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                            <div>
                              {typeof improvement === 'object' ? (
                                <>
                                  <p className="text-gray-700 dark:text-gray-300 font-medium">{improvement.area}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{improvement.recommendation}</p>
                                  {improvement.priority && (
                                    <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded mt-1 inline-block">
                                      {improvement.priority} priority
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                {data.aiReport.recommendations && data.aiReport.recommendations.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Actionable Recommendations</h3>
                    <div className="space-y-3">
                      {data.aiReport.recommendations.map((rec, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          {typeof rec === 'object' ? (
                            <>
                              <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{rec.recommendation}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{rec.rationale}</p>
                              <div className="flex gap-2">
                                {rec.priority && (
                                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                    {rec.priority} priority
                                  </span>
                                )}
                                {rec.expectedOutcome && (
                                  <span className="text-xs text-gray-500 dark:text-gray-500">
                                    Expected: {rec.expectedOutcome}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Question Analytics */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Question Analytics</h2>
              {Object.entries(data.analytics.questionAnalytics).map(([questionId, analytics]) => {
                const stats = calculateStats(analytics.responses);
                const maxCount = Math.max(...Object.values(stats.distribution), 0);
                
                return (
                  <div key={questionId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      {analytics.question}
                    </h3>
                    <div className="mb-2">
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                        {analytics.inputType}
                      </span>
                    </div>
                    
                    {stats.total > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(stats.distribution).map(([answer, count]) => {
                          const percentage = (count / stats.total) * 100;
                          return (
                            <div key={answer}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{answer}</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {count} ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No responses yet</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Recent Submissions */}
            {data.submissions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Submissions</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Submitted At
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Responses
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data.submissions.slice(0, 10).map((submission, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {new Date(submission.completedAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {submission.responses.length} responses
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormReports;

