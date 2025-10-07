import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

const FormCreator = () => {
  const [consentOpen, setConsentOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const navigate = useNavigate();

  const handleConsentToggle = () => {
    setConsentOpen(!consentOpen);
  };

  const handleFormClick = (formType) => {
    setActiveForm(formType);
    console.log(`Creating form of type: ${formType}`);
    navigate('/templateSelection');
  };

  const logoutSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const formOptionSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 100,
    config: { mass: 1, tension: 300, friction: 50 },
  });

  const mainContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };


  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-200 md:flex-row flex-col overflow-hidden">
      {/* Left Sidebar */}
      <motion.div
        className="w-full md:w-64 bg-white shadow-lg p-4 flex flex-col justify-between"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div>
          <div className="mb-8">
            <h1 className="text-blue-700 text-2xl font-extrabold tracking-tight">Formora</h1>
            <p className="text-sm text-gray-500">Create beautiful forms effortlessly.</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search themes..."
              className="w-full pl-8 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Form Types Menu */}
          <nav className="space-y-2">
            <motion.div
              className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl cursor-pointer transition-colors duration-200"
              onClick={() => handleFormClick('feedback')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Feedback Form</span>
              <ChevronDown className="h-4 w-4" />
            </motion.div>

            <motion.div
              className="flex flex-col"
              onClick={handleConsentToggle}
            >
              <motion.div
                className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl cursor-pointer transition-colors duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Consent Form</span>
                {consentOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </motion.div>

              <AnimatePresence>
                {consentOpen && (
                  <motion.div
                    className="pl-4 space-y-2 overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <animated.div style={formOptionSpring}>
                      <div
                        className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl cursor-pointer transition-colors duration-200 text-sm"
                        onClick={() => handleFormClick('informed_consent')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Informed Consent
                      </div>
                    </animated.div>
                    <animated.div style={formOptionSpring}>
                      <div
                        className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl cursor-pointer transition-colors duration-200 text-sm"
                        onClick={() => handleFormClick('guardian_consent')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Guardian Consent
                      </div>
                    </animated.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {['Invitation Form', 'Registration Form', 'Application Form', 'Survey Form', 'Contact Form', 'Complaint Form'].map((form) => (
              <motion.div
                key={form}
                className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl cursor-pointer transition-colors duration-200"
                onClick={() => handleFormClick(form.toLowerCase().replace(/ /g, '_'))}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>{form}</span>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <animated.div className="p-4" style={logoutSpring}>
          <motion.button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </motion.button>
        </animated.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 p-8"
        variants={mainContentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200">
              <span className="sr-only">Dashboard</span>
              ⊞
            </button>
            <button className="p-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors duration-200">
              <span className="sr-only">Favorites</span>
              ⭐
            </button>
            <span className="text-gray-700 font-medium">Dashboards</span>
            <span className="text-gray-700 font-medium">User</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200">
              <Search className="h-4 w-4" />
              <span>Search</span>
              <span className="text-xs bg-white px-2 rounded-full">⌘K</span>
            </button>
            <button className="p-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors duration-200">🌙</button>
            <button className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition-colors duration-200">⚙️</button>
            <button className="p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors duration-200">👤</button>
            <button className="p-2 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors duration-200">▢</button>
          </div>
        </div>

        {/* Main Content Area */}
        <section className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
            Unleash Your Creativity—Design Forms with Ease!
          </h1>
          <p className="text-center text-gray-500 mb-12">Choose a method to start creating your form.</p>

          <div className="flex justify-center gap-10 flex-wrap">
            <motion.div
              className="bg-blue-50 text-blue-700 p-10 rounded-2xl shadow-md flex flex-col items-center gap-4 w-56 cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => handleFormClick('manual')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-5xl">📄</div>
              <span className="font-semibold">Manual</span>
              <p className="text-sm text-center text-gray-500">Build from scratch with drag-and-drop.</p>
            </motion.div>
            <motion.div
              className="bg-purple-50 text-purple-700 p-10 rounded-2xl shadow-md flex flex-col items-center gap-4 w-56 cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => handleFormClick('ai')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-5xl">🤖</div>
              <span className="font-semibold">AI</span>
              <p className="text-sm text-center text-gray-500">Generate a form with AI magic.</p>
            </motion.div>
            <motion.div
              className="bg-green-50 text-green-700 p-10 rounded-2xl shadow-md flex flex-col items-center gap-4 w-56 cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => handleFormClick('hybrid')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-5xl">🔗</div>
              <span className="font-semibold">Hybrid</span>
              <p className="text-sm text-center text-gray-500">Combine AI with manual customization.</p>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default FormCreator;