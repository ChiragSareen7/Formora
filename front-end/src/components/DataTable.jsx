import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, LogOut, Moon, Sun, Bell, Layout, Grid, List, ExternalLink } from 'lucide-react';

const WorkspaceDashboard = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [gridView, setGridView] = useState(false);
    const data = [
        { name: 'Segun Adebayo', title: 'Founder of Chakra UI', email: 'sage@chakra-ui.com' },
        { name: 'Mark Chandler', title: 'Developer', email: 'mark@chakra-ui.com' },
        { name: 'Lazar Nikolov', title: 'DevRel', email: 'lazar@chakra-ui.com' },
        { name: 'Javier Alaves', title: 'Designer', email: 'javi@chakra-ui.com' },
        { name: 'Segun Adebayo', title: 'Founder of Chakra UI', email: 'sage@chakra-ui.com' },
        { name: 'Mark Chandler', title: 'Developer', email: 'mark@chakra-ui.com' },
        { name: 'Lazar Nikolov', title: 'DevRel', email: 'lazar@chakra-ui.com' },
        { name: 'Javier Alaves', title: 'Designer', email: 'javi@chakra-ui.com' }
    ];

    const [sidebarWidth, setSidebarWidth] = useState(256); // Initial width
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleGridView = () => {
        setGridView(!gridView);
    };

    const listVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    const gridVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 } },
    };

    const gridItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    };
    const sidebarRef = useRef(null);

    useEffect(() => {
        const updateSidebarWidth = () => {
            if (sidebarRef.current) {
                const width = sidebarRef.current.offsetWidth;
                setSidebarWidth(width);
            }
        };

        // Call it once to set the initial width
        updateSidebarWidth();

        // Add event listener to update width on window resize
        window.addEventListener('resize', updateSidebarWidth);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateSidebarWidth);
        };
    }, []);

    return (
        <motion.div
            className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-violet-50'} transition-colors duration-300`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.75, ease: 'easeOut' } }}
        >
            {/* Sidebar */}
            <motion.div
                ref={sidebarRef}
                className={`w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-screen shrink-0 p-4 fixed shadow-lg transition-colors duration-300 z-10`} // z-index for layering
                initial={{ x: -256 }}
                animate={{ x: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
            >
                <div className="mb-8">
                    <img src="/api/placeholder/120/30" alt="Formora" className="mb-6" />
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className={`w-full px-3 py-2 rounded-lg pl-9 text-sm focus:outline-none transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <div className="space-y-3">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg w-full hover:bg-purple-200 transition-colors duration-200">
                        <Layout className="w-4 h-4" />
                        <span>Workspace</span>
                        <span className="ml-auto">+</span>
                    </button>

                    <div className="pl-4 space-y-2">
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} py-1 transition-colors duration-300`}>Workspace 1</div>
                        <div className="font-medium py-1 text-indigo-500">
                            Workspace 2
                            <div className="pl-4 space-y-2 mt-1">
                                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Feedback responses</div>
                                <div className="text-indigo-500">Participation</div>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    className="absolute bottom-4 left-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <button className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-red-500 transition-colors duration-200`}>
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </motion.div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-hidden" style={{marginLeft: sidebarWidth}}> {/* Add this style and class */}
                <motion.div
                    className="flex justify-between items-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }}
                >
                    <div className="flex items-center space-x-4">
                        <Layout className="w-5 h-5" />
                        <span className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Dashboards</span>
                        <span className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>User</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <motion.button
                            className={`p-2 rounded-lg focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 shadow-sm'}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Search"
                        >
                            <Search className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            className={`p-2 rounded-lg focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 shadow-sm'}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleDarkMode}
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4" />}
                        </motion.button>
                        <motion.button
                            className={`p-2 rounded-lg focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 shadow-sm'}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Notifications"
                        >
                            <Bell className="w-4 h-4" />
                        </motion.button>
                        <button className={`p-2 rounded-lg focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white shadow-sm'} `} aria-label="User Menu">⬚</button>
                    </div>
                </motion.div>

                <motion.div
                    className="flex justify-between items-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }}
                >
                    <h1 className="text-xl font-semibold">Workspace 2 : Participation</h1>
                    <div className="flex items-center space-x-2">
                        <select className={`px-3 py-1 rounded-lg text-sm focus:outline-none transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                            <option>Date created</option>
                        </select>
                        <motion.button
                            className={`p-2 rounded-lg focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 shadow-sm'}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleGridView}
                            aria-label="Toggle List View"
                        >
                            <List className={`w-4 h-4 ${gridView ? 'text-gray-400' : ''}`} />
                        </motion.button>
                        <motion.button
                            className={`p-2 rounded-lg focus:outline-none transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 shadow-sm'}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleGridView}
                            aria-label="Toggle Grid View"
                        >
                            <Grid className={`w-4 h-4 ${!gridView ? 'text-gray-400' : ''}`} />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Data display - List or Grid view */}
                <div className="overflow-auto">
                    {gridView ? (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={gridVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {data.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className={`rounded-lg shadow-md p-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300 hover:scale-105`}
                                    variants={gridItemVariants}
                                >
                                    <h3 className="font-semibold text-lg text-violet-800">{item.name}</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{item.title}</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{item.email}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className={`rounded-lg shadow-md  ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <table className="w-full min-w-600">
                                <thead>
                                    <tr className="text-left text-sm border-b">
                                        <th className="px-5 py-4 text-gray-700 font-semibold">NAME</th>
                                        <th className="px-5 py-4 text-gray-700 font-semibold">TITLE</th>
                                        <th className="px-5 py-4 text-gray-700 font-semibold">EMAIL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <motion.tr
                                            key={index}
                                            className={`${index % 2 === 0 ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') : ''} hover:bg-gray-200 transition-colors duration-200`}
                                            variants={listVariants}
                                        >
                                            <td className="px-5 py-4 text-gray-800">{item.name}</td>
                                            <td className="px-5 py-4 text-gray-600">{item.title}</td>
                                            <td className="px-5 py-4 text-gray-600">{item.email}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </div>

                <motion.div
                    className="flex justify-end mt-6 space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }}
                >
                    <motion.button
                        className="flex items-center space-x-2 px-5 py-3 border rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Train a Model</span>
                    </motion.button>
                    <motion.button
                        className="flex items-center space-x-2 px-5 py-3 bg-indigo-500 text-gray-80 rounded-lg hover:bg-indigo-600 transition-colors duration-200 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Analyze with AI</span>
                    </motion.button>
                    <motion.button
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Export</span>
                        <ExternalLink className="w-4 h-4" />
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default WorkspaceDashboard;