export const StrategyCard = ({ title, status, year, actions }) => (
  <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-sm text-gray-500">{year}</p>
      </div>
      <span
        className={`text-xs px-3 py-1 rounded-full ${
          status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {status}
      </span>
    </div>
    <div className="space-y-2">
      {actions.map((action, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input type="checkbox" checked={action.completed} className="accent-blue-500" readOnly />
          <span className="text-sm text-gray-700">{action.description}</span>
        </div>
      ))}
    </div>
  </div>
);

export const MetricCard = ({ label, count, bgColor }) => (
  <div className={`p-5 rounded-xl shadow-md transition-transform transform hover:scale-105 ${bgColor || 'bg-blue-100'}`}>
    <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
    <p className="text-2xl font-bold text-gray-900">{count}</p>
  </div>
);

export const AnalyzedPoint = ({ issue, type, reason, detailsType }) => (
  <div className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
    <h3 className="text-md font-medium text-gray-800">{issue}</h3>
    <p className="text-sm text-gray-500">Type: {type}</p>
    <p className="text-sm text-gray-500">Reason: {reason}</p>
    <button className="text-blue-500 text-sm mt-2 hover:underline">{detailsType === 'view' ? 'View Details' : 'Take Action'}</button>
  </div>
);

export const TaskItem = ({ label, count, actionType, iconColor }) => (
  <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
    <div className={`w-12 h-12 ${iconColor} rounded-full flex items-center justify-center text-lg font-semibold text-white`}>
      {count}
    </div>
    <div>
      <h4 className="text-md font-semibold text-gray-800">{label}</h4>
      <p className="text-sm text-gray-500">{actionType}</p>
    </div>
  </div>
);
