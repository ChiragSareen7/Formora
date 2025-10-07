import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const TemplatePreview = ({ template, onClose }) => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNextSlide = () => {
        setCurrentSlide((prev) => Math.min(prev + 1, template.previewImages.length - 1));
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    };

    const slideVariants = {
        hidden: { opacity: 0, x: "100%" },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeInOut" } },
        exit: { opacity: 0, x: "-100%", transition: { duration: 0.5, ease: "easeInOut" } }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-violet-900 bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="bg-indigo-100 w-screen h-screen max-w-full max-h-full p-6 md:p-8 relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                {/* Close Button */}
                <motion.button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 md:p-2 hover:bg-violet-100 text-gray-500 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X size={20} />
                </motion.button>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-semibold text-indigo-800 mb-4">{template.title}</h2>

                {/* Image Slides */}
                <div className="relative overflow-hidden shadow-lg">
                    <motion.img
                        key={currentSlide}
                        src={template.previewImages[currentSlide]}
                        alt={`${template.title} - Slide ${currentSlide + 1}`}
                        className="w-full h-[60vh] object-contain"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between p-2 md:p-4">
                        <motion.button
                            onClick={handlePrevSlide}
                            className="p-2  bg-white bg-opacity-75 shadow-md hover:bg-violet-200 transition-colors duration-200"
                            disabled={currentSlide === 0}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ChevronLeft size={24} />
                        </motion.button>
                        <motion.button
                            onClick={handleNextSlide}
                            className="p-2  bg-white bg-opacity-75 shadow-md hover:bg-violet-200 transition-colors duration-200"
                            disabled={currentSlide === template.previewImages.length - 1}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ChevronRight size={24} />
                        </motion.button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="mt-4 md:mt-6 flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="md:w-1/2">
                        <h3 className="font-semibold text-lg text-indigo-700 mb-2">Template Features</h3>
                        <ul className="space-y-1 text-sm text-gray-700">
                            {template.features.map((feature, index) => (
                                <li key={index} className="flex items-center space-x-1">
                                    <span className="text-blue-500">•</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <motion.button
                        // onClick={() => window.location.href = template.link}
                        onClick = {() => navigate('/form-creation')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-700 text-white  hover:bg-gradient-to-br focus:ring-2 focus:ring-blue-300 shadow-md transition-colors duration-200 md:w-auto w-full font-medium"
                        whileHover={{ scale: 1.05, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Use Template
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TemplatePreview;