import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { buildApiUrl } from '../config/api';

const AIFormFill = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await axios.get(buildApiUrl(`/api/ai-forms/${formId}`));
      if (response.data.success) {
        const formData = response.data.form;
        setForm(formData);
        
        // Initialize visible questions with only initial (non-follow-up) questions
        const initialQuestions = formData.initialQuestions
          .filter(q => !q.isFollowUp)
          .sort((a, b) => a.order - b.order);
        setVisibleQuestions(initialQuestions);
      }
    } catch (err) {
      console.error('Error fetching form:', err);
      setError('Failed to load form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Mark question as answered
    setAnsweredQuestions(prev => new Set([...prev, questionId]));

    // Generate follow-up questions if needed
    generateFollowUpQuestions(questionId, answer);
  };

  const generateFollowUpQuestions = async (questionId, answer) => {
    // Don't generate follow-ups for follow-up questions
    const question = form.initialQuestions.find(q => q.questionId === questionId);
    if (question?.isFollowUp) return;

    setIsGeneratingFollowUp(true);
    try {
      const allResponses = Object.entries(responses).map(([qId, ans]) => {
        const q = form.initialQuestions.find(qu => qu.questionId === qId);
        return {
          question: q?.question || '',
          answer: ans
        };
      });
      allResponses.push({
        question: question?.question || '',
        answer: answer
      });

      const response = await axios.post(
        buildApiUrl(`/api/ai-forms/${formId}/followup`),
        {
          questionId,
          answer,
          allResponses
        }
      );

      if (response.data.success && response.data.followUpQuestions?.length > 0) {
        // Add follow-up questions to visible questions
        const followUps = response.data.followUpQuestions.map((q, index) => ({
          ...q,
          order: 1000 + index // Place after initial questions
        }));

        setVisibleQuestions(prev => {
          const existing = prev.map(q => q.questionId);
          const newFollowUps = followUps.filter(q => !existing.includes(q.questionId));
          return [...prev, ...newFollowUps].sort((a, b) => a.order - b.order);
        });

        // Update form with new questions
        setForm(prev => ({
          ...prev,
          initialQuestions: [...prev.initialQuestions, ...followUps]
        }));
      }
    } catch (err) {
      console.error('Error generating follow-up:', err);
      // Don't show error to user, just continue
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  const handleSubmit = async () => {
    // Validate required questions
    const requiredQuestions = visibleQuestions.filter(q => q.required);
    const missingRequired = requiredQuestions.filter(q => !responses[q.questionId]);

    if (missingRequired.length > 0) {
      setError(`Please answer all required questions: ${missingRequired.map(q => q.question).join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const submissionData = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      await axios.post(buildApiUrl(`/api/ai-forms/${formId}/submit`), {
        responses: submissionData
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    const answer = responses[question.questionId] || '';

    switch (question.inputType) {
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                  answer === option
                    ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={question.questionId}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                  className="w-4 h-4 text-purple-600 dark:text-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-2"
                />
                <span className={`text-sm sm:text-base ${answer === option ? 'text-purple-700 dark:text-purple-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={answer}
            onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
            placeholder={question.placeholder || "Your answer..."}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 resize-none text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
            rows={4}
          />
        );

      case 'text':
        return (
          <input
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
            placeholder={question.placeholder || "Your answer..."}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
          />
        );

      case 'select':
        return (
          <select
            value={answer}
            onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
          >
            <option value="">Select an option...</option>
            {question.options && question.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'rating':
        const min = question.options && question.options.length > 0 ? parseInt(question.options[0]) : 1;
        const max = question.options && question.options.length > 0 ? parseInt(question.options[question.options.length - 1]) : 5;
        return (
          <div className="flex items-center space-x-2">
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleAnswerChange(question.questionId, String(rating))}
                className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                  answer === String(rating)
                    ? 'bg-purple-600 dark:bg-purple-500 text-white border-purple-600 dark:border-purple-500'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
            placeholder={question.placeholder || "Your answer..."}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading form...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md text-center transition-colors duration-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Thank You!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your feedback has been submitted successfully.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Form not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 transition-colors duration-200">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 break-words">{form.title}</h1>
          </div>
          {form.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{form.description}</p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {visibleQuestions.map((question, index) => (
            <div
              key={question.questionId}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transition-colors duration-200 ${
                question.isFollowUp ? 'border-l-4 border-purple-500 dark:border-purple-400' : ''
              }`}
            >
              {question.isFollowUp && (
                <div className="mb-2">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                    Follow-up Question
                  </span>
                </div>
              )}
              <div className="flex items-start space-x-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <label className="block text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {question.question}
                    {question.required && (
                      <span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    )}
                  </label>
                  {renderQuestion(question)}
                </div>
              </div>
            </div>
          ))}

          {isGeneratingFollowUp && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300">Generating follow-up questions...</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Feedback</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIFormFill;

