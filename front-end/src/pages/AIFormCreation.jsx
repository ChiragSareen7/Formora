import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { buildApiUrl } from '../config/api';

const AIFormCreation = () => {
  const navigate = useNavigate();
  const [businessDescription, setBusinessDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedForm, setGeneratedForm] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateForm = async () => {
    if (!businessDescription.trim()) {
      setError('Please enter a business description');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedForm(null);

    try {
      const response = await axios.post(buildApiUrl('/api/ai-forms/generate'), {
        businessDescription: businessDescription.trim()
      });

      if (response.data.success) {
        setGeneratedForm(response.data.form);
      } else {
        setError(response.data.message || 'Failed to generate form');
      }
    } catch (err) {
      console.error('Error generating form:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to generate form. Please try again.';
      const errorDetails = err.response?.data?.details || '';
      setError(`${errorMessage}${errorDetails ? `\n\nDetails: ${errorDetails}` : ''}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewForm = () => {
    if (generatedForm) {
      navigate(`/ai-form/${generatedForm.formId}`);
    }
  };

  const handleCreateAnother = () => {
    setBusinessDescription('');
    setGeneratedForm(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      {/* Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">AI Form Creator</h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!generatedForm ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 transition-colors duration-200">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Create Your AI-Powered Form
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Simply describe what kind of feedback form you need, and AI will generate it for you
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe Your Form Needs
                </label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Example: Nike wants feedback on their new shoe line - comfort, price, looks, quality, etc."
                  className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                  disabled={isGenerating}
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Be specific about what feedback you want to collect. The AI will create relevant questions automatically.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg whitespace-pre-wrap">
                  <div className="font-semibold mb-1">Error:</div>
                  <div className="text-sm">{error}</div>
                </div>
              )}

              <button
                onClick={handleGenerateForm}
                disabled={isGenerating || !businessDescription.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Form...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate AI Form</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-1">
                  Form Generated Successfully!
                </h3>
                <p className="text-green-700 dark:text-green-400">
                  Your AI-powered form has been created with {generatedForm.initialQuestions?.length || 0} questions.
                </p>
              </div>
            </div>

            {/* Form Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transition-colors duration-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{generatedForm.title}</h3>
              {generatedForm.description && (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">{generatedForm.description}</p>
              )}

              <div className="space-y-4">
                {generatedForm.initialQuestions?.map((question, index) => (
                  <div key={question.questionId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">{question.question}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="inline-block bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded mr-2">
                            {question.inputType}
                          </span>
                          {question.options && question.options.length > 0 && (
                            <span className="text-gray-600 dark:text-gray-300">
                              {question.options.length} options
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleViewForm}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>View & Share Form</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCreateAnother}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFormCreation;

