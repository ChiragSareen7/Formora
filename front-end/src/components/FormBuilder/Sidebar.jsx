import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Grid, Plus, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white p-4 border-r border-gray-200">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-blue-600">Formora</h1>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <Grid size={18} />
            </div>
            <span className="text-sm font-medium">Workspace</span>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 bg-gray-100 rounded-md pl-9"
        />
        <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
      </div>

      <div className="space-y-2">
        <div 
          className="px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100"
          onClick={() => navigate('/workspace/1')}
        >
          Workspace 1
        </div>
        <div 
          className="px-2 py-1.5 text-sm bg-blue-50 text-blue-600 rounded cursor-pointer"
          onClick={() => navigate('/workspace/2')}
        >
          Workspace 2
          <div className="pl-4 mt-2 space-y-1 text-gray-600">
            <div className="text-sm cursor-pointer hover:text-blue-600">Feedback responses</div>
            <div className="text-sm font-medium cursor-pointer hover:text-blue-600">Participation</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4">
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;