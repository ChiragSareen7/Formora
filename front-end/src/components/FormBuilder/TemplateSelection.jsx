import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Grid, List, LogOut, Sparkles, BookOpen, UserPlus, Mail, Menu } from 'lucide-react';
import TemplatePreview from './TemplatePreview'; // Import the TemplatePreview component
import form from '../../../public/form.jpg'

const FormTemplateSelector = () => {
    const navigate = useNavigate();
    const [activeFormType, setActiveFormType] = useState(null);
    const [isGridView, setIsGridView] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
    const mainContentRef = useRef(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null); // State for selected template

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formTypes = [
        { name: 'Feedback Form', icon: Mail },
        { name: 'Consent Form', icon: UserPlus },
        { name: 'Informed Consent', icon: BookOpen },
        { name: 'Guardian Consent', icon: UserPlus },
        { name: 'Invitation Form', icon: Sparkles },
        { name: 'Registration Form', icon: UserPlus },
        { name: 'Application Form', icon: UserPlus },
        { name: 'Survey Form', icon: Mail },
        { name: 'Contact Form', icon: Mail },
        { name: 'Complaint Form', icon: Mail }
    ];

    const templates = Array(9).fill(null).map((_, i) => ({
        id: i,
        title: `Registration Form ${i + 1}`,
        theme: i % 2 === 0 ? 'light' : 'dark',
        image: form,
        // Example preview data
        previewImages: [
            `/api/placeholder/600/400?random=${i + 10}`,
            `/api/placeholder/600/400?random=${i + 11}`,
            `/api/placeholder/600/400?random=${i + 12}`,
        ],
        steps: 3,
        features: ['Easy customization', 'Mobile responsive', 'Clean design'],
    }));

    const sidebarNavVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut", staggerChildren: 0.05 } }
    };

    const sidebarNavItemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } }
    };

    const handleFormTypeClick = (type) => {
        setActiveFormType(type === activeFormType ? null : type);
        !isSmallScreen && setIsSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const templateVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: "easeInOut" },
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 },
        },
    };

    const openTemplatePreview = (template) => {
        setSelectedTemplate(template);
    };

    const closeTemplatePreview = () => {
        setSelectedTemplate(null);
    };

    const handleUseTemplate = (template) => {
        navigate('/form-builder', { state: { template } }); // Directly navigate to form builder
        closeTemplatePreview(); // Optionally close the preview after navigation
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 font-sans antialiased overflow-hidden">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-md p-4 flex items-center justify-between z-30">
                <div className="flex items-center">
                    {isSmallScreen && (
                        <motion.button
                            onClick={toggleSidebar}
                            className="mr-4 md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Menu className="w-6 h-6" />
                        </motion.button>
                    )}
                    <img src="/api/placeholder/120/30" alt="Formora" />
                </div>
                <div>
                    <motion.button
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </motion.button>
                </div>
            </nav>

            <div className="flex flex-grow">
                {/* Sidebar */}
                <aside
                    className={`w-full md:w-64 bg-white shadow-xl p-4 flex flex-col justify-between fixed top-0 left-0 h-screen z-20 transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:static top-16 h-[calc(100vh - 4rem)] overflow-y-auto`}
                    style={{ height: 'calc(100vh - 4rem)' }}
                >
                    <div>
                        <div className="mb-8 flex flex-col items-center">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search themes..."
                                    className="w-full px-3 py-2 border rounded-full bg-gray-50 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-300 pl-10"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            </div>
                        </div>

                        <motion.nav variants={sidebarNavVariants} initial="hidden" animate="visible" className="space-y-2">
                            {formTypes.map((type, index) => (
                                <motion.div
                                    key={index}
                                    variants={sidebarNavItemVariants}
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors duration-200
                                        ${activeFormType === type.name ? 'bg-gradient-to-r from-purple-400 to-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => { handleFormTypeClick(type.name); toggleSidebar(); }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="flex items-center space-x-2">
                                        {React.createElement(type.icon, { className: "w-4 h-4" })}
                                        <span className="text-sm">{type.name}</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ transform: activeFormType === type.name ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                </motion.div>
                            ))}
                        </motion.nav>
                    </div>

                    {!isSmallScreen && (
                        <div className="mt-8 pt-4 border-t border-gray-200">
                            <motion.button
                                onClick={() => navigate('/')}
                               className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </motion.button>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 min-w-[62.5rem] ">
                    {/* Scrollable Content Wrapper */}
                    <div className="h-[calc(100vh-3rem)] overflow-y-auto">
                    <header className="mb-6">
                        <motion.h1
                            className="text-3xl font-extrabold mb-2 text-gray-800"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}
                        >
                            Explore Our Form Templates
                        </motion.h1>
                        <motion.p
                            className="text-purple-600 text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } }}
                        >
                            Jumpstart your form creation with our professionally designed templates.
                        </motion.p>
                    </header>

                    <div className="flex justify-end mb-4 space-x-2">
                        <motion.button
                            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setIsGridView(false)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <List className={`w-5 h-5 ${!isGridView ? 'text-purple-600' : 'text-gray-600'}`} />
                        </motion.button>
                        <motion.button
                            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setIsGridView(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Grid className={`w-5 h-5 ${isGridView ? 'text-purple-600' : 'text-gray-600'}`} />
                        </motion.button>
                    </div>

                    <motion.div
                        className={`grid ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15 },
                            },
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                        {templates.map((template) => (
                            <motion.div
                                key={template.id}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                variants={templateVariants}
                                whileHover="hover"
                            >
                                <div className={`aspect-[4/3] rounded-t-xl relative overflow-hidden`}>
                                    <img
                                        src={template.image}
                                        alt={template.title}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-4 bg-white flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-800 mb-2">{template.title}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            Create professional forms quickly and easily with this template.
                                        </p>
                                    </div>
                                    <div className="flex justify-center items-center mt-4">
                                        <motion.button
                                            className="px-4 py-2 text-sm bg-purple-500 text-black rounded-full hover:bg-purple-600 transition-colors duration-200"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openTemplatePreview(template);
                                            }}
                                        >
                                            Use Template
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    </div>
                </main>
            </div>
            {/* Render TemplatePreview conditionally */}
            {selectedTemplate && (
                <TemplatePreview
                    template={selectedTemplate}
                    onClose={closeTemplatePreview}
                    onUseTemplate={() => {
                        closeTemplatePreview();
                        navigate('/form-builder', { state: { template: selectedTemplate } });
                    }}
                />
            )}
        </div>
    );
};

export default FormTemplateSelector;