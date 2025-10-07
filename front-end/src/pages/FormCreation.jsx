import React, { useState } from 'react';
import { Settings, Play, Clock, RotateCcw, Percent, Settings2, PlusCircle, Palette, LayoutGrid, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FormCreation = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [choices, setChoices] = useState([]);

  const addChoice = () => {
    setChoices([...choices, `Choice ${choices.length + 1}`]);
  };

  const editChoice = (index) => {
    const newChoice = prompt("Edit choice:", choices[index]);
    if (newChoice !== null) {
      const updatedChoices = [...choices];
      updatedChoices[index] = newChoice;
      setChoices(updatedChoices);
    }
  };

  const deleteChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white shadow-lg">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-200 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 4h16v2H2V4zm0 5h16v2H2V9zm0 5h16v2H2v-2z"/>
            </svg>
          </button>
          <span className="text-sm font-semibold">My workspace</span>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-semibold">My form creation</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r h-full p-4">
          <div className="bg-purple-200 p-3 rounded-lg flex items-center space-x-2 shadow-sm">
            <span className="w-6 h-6 flex items-center justify-center bg-purple-600 text-white rounded-full">1</span>
            <span className="text-sm font-medium">Question</span>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white border rounded-xl p-6 shadow-lg mb-4">
            <div className="flex items-center space-x-2 text-gray-400 mb-4">
              <span>1 →</span>
              <input 
                type="text" 
                placeholder="Your question here. Recall information with @"
                className="flex-1 text-xl outline-none placeholder-gray-400 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <input 
              type="text" 
              placeholder="Description (optional)"
              className="w-full outline-none text-gray-400 bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
            />
            {choices.map((choice, index) => (
              <div key={index} className="flex items-center justify-between text-blue-600 bg-blue-50 p-3 rounded-lg shadow-sm mt-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{choice}</span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => editChoice(index)} className="text-gray-600 hover:text-gray-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteChoice(index)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button 
              onClick={addChoice} 
              className="text-blue-600 mt-4 bg-blue-100 px-4 py-2 rounded-lg shadow-md hover:bg-blue-200"
            >
              + Add choice
            </button>
          </div>
          
          {/* Publish Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-700 transition-colors" onClick ={()=> navigate('/dashboard')}>
              Publish Form
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 bg-white border-l p-4">
          <h3 className="font-semibold mb-4">Question</h3>
          <div className="flex space-x-2 mb-4">
            <button className="px-4 py-2 bg-gray-100 rounded text-sm font-medium">Text</button>
            <button className="px-4 py-2 border rounded text-sm font-medium">Video</button>
          </div>
          <div className="bg-purple-200 p-3 rounded-lg mb-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <LayoutGrid className="w-5 h-5 text-purple-600" />
              <span>Multiple Choice</span>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Settings</h4>
            <div className="space-y-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium w-full">
                <Settings2 className="w-5 h-5 text-gray-600" />
                <span>Required</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium w-full">
                <Percent className="w-5 h-5 text-gray-600" />
                <span>Multiple Selection</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium w-full">
                <RotateCcw className="w-5 h-5 text-gray-600" />
                <span>Randomize</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium w-full">
                <Palette className="w-5 h-5 text-gray-600" />
                <span>Other Option</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium w-full">
                <LayoutGrid className="w-5 h-5 text-gray-600" />
                <span>Vertical Alignment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCreation;