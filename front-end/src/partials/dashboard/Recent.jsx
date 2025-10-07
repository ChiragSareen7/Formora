import React from 'react';

function DashboardCard12({ feedbacks = [], highPriority = [] }) {
  // Hardcoded icon (applies to all feedback items)
  const feedbackIcon = "M18 8C12.477 8 8 12.477 8 18s4.477 10 10 10 10-4.477 10-10-10z";

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recurring Themes</h2>
      </header>
      <div className="p-3">
        {/* Feedbacks Group */}
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">
            Feedbacks
          </header>
          <ul className="my-1">
            {feedbacks.length > 0 ? (
              feedbacks.map((item, index) => (
                <li key={index} className="flex px-2">
                  <div className="w-9 h-9 rounded-full shrink-0 bg-pink-500 my-2 mr-3">
                    <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
                      <path d={feedbackIcon} />
                    </svg>
                  </div>
                  <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                    <div className="grow flex justify-between">
                      <div className="self-center">
                        <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">
                          {item.title}
                        </a>
                      </div>
                      <div className="shrink-0 self-end ml-2">
                        <a className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">
                          View<span className="hidden sm:inline"> →</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-2">No feedback available</p>
            )}
          </ul>
        </div>

        {/* High Priority Group */}
        <div>
          <header className="text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">
            High Priority
          </header>
          <ul className="my-1">
            {highPriority.length > 0 ? (
              highPriority.map((item, index) => (
                <li key={index} className="flex px-2">
                  <div className="w-9 h-9 rounded-full shrink-0 bg-blue-500 my-2 mr-3">
                    <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
                      <path d={feedbackIcon} />
                    </svg>
                  </div>
                  <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                    <div className="grow flex justify-between">
                      <div className="self-center">
                        <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">
                          {item.title}
                        </a>
                      </div>
                      <div className="shrink-0 self-end ml-2">
                        <a className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">
                          View<span className="hidden sm:inline"> →</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-2">No high-priority items available</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard12;
