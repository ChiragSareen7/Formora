import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, ChevronDown, Grid, List, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FormDashboard = () => {
  const navigate = useNavigate();

  const [isGridView, setIsGridView] = useState(true);
  const [showTemplates, setShowTemplates] = useState(true);

  const handleTemplateClick = (title) => {
    console.log(`Using template: ${title}`);
  };

  const handleDeleteTemplate = (title) => {
    console.log(`Deleting template: ${title}`);
  };

  const handleIncreaseLimit = () => {
    navigate('/increase-limit');
  };

  const handleCreateForm = () => {
    navigate('/form-builder');
  };

  return (
    <motion.div
      className="h-screen w-screen bg-gray-200 text-gray-900 overflow-hidden flex flex-col"  // Added flex and flex-col
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b bg-gray shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-900 rounded-lg flex items-center justify-center text-violet-300 font-semibold">
            G
          </div>
          <span className="font-medium text-gray-800">User</span>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            className="bg-brown-600 text- px-4 py-2 rounded-lg shadow-md hover:bg-brown-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTemplates(!showTemplates)}
          >
            {showTemplates ? "Hide Templates" : "View Templates"}
          </motion.button>
          <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
            ?
          </button>
          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center font-semibold">
            GA
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row h-full"> {/* h-full for main content area */}
        {/* Sidebar */}
        <motion.div
          className="w-full md:w-72 border-r bg-white  p-5 shadow-md flex flex-col justify-between"  // Removed h-screen, added flex and justify-between
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
            <div>  {/* Content Section for the actual sidebar links and info */}
                <motion.button
                    className="w-full flex items-center gap-2 p-3 bg-purple-600 text-black rounded-lg shadow hover:bg-purple-700 transition mb-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateForm}
                >
                    <Plus className="h-4 w-4" /> Create a new form
                </motion.button>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-700">Workspaces</h2>
                    <div className="mt-2 p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                        <span>My workspace</span>
                        <span className="text-gray-500">2</span>
                    </div>
                </div>

                <div className="text-sm font-medium text-gray-800 mb-2">Responses collected</div>
                <div className="text-sm text-gray-600">0 / 10</div>
                <div className="text-xs text-gray-500 mt-1">Resets on Mar 6</div>
            </div>
             {/* Increase Limit Button placed at the bottom of the Sidebar*/}
            <motion.button
                className="w-full mt-4 p-2 border rounded-lg text-purple-600 hover:bg-purple-100 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleIncreaseLimit}
            >
                Increase response limit
            </motion.button>

        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">My workspace</h1>
            <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-full hover:bg-gray-300 transition ${isGridView ? 'bg-gray-300' : ''}`}
                onClick={() => setIsGridView(true)}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                className={`p-2 rounded-full hover:bg-gray-300 transition ${!isGridView ? 'bg-gray-300' : ''}`}
                onClick={() => setIsGridView(false)}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Template Cards */}
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {["Event Registration", "Customer Feedback"].map((title, index) => (
                  <motion.div
                    key={index}
                    className="p-5 border-2 border-purple-200 bg-white rounded-lg shadow-sm flex flex-col justify-between"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-gray-700">Create a {title} Form</span>
                      </div>
                      <motion.button
                        className="text-gray-500 hover:text-gray-700 transition"
                        onClick={() => handleDeleteTemplate(title)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                    <motion.button
                      className="px-4 py-2 border rounded-lg text-purple-600 hover:bg-purple-100 transition self-start"
                      onClick={() => handleTemplateClick(title)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Use this form
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600 px-4">
              <span>My Forms</span>
              <span></span>
            </div>
            {/* Form List Items */}
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                className={`flex items-center justify-between p-4 bg-white rounded-lg shadow border hover:shadow-lg transition ${!isGridView ? 'flex-col items-start' : ''}`}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-200 rounded-lg"></div>
                  <span>My new form</span>
                </div>
                <span>-</span>
                <span>-</span>
                <span>06 Feb 2025</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
                    <Grid className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FormDashboard;