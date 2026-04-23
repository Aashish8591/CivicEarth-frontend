import React from 'react';

const LeftSidebar = ({ currentUser, activeFilter, onFilterChange }) => {
  const isAuthority = currentUser.isAuthority;
  const displayName = isAuthority ? `#${currentUser.authorityId}` : currentUser.username;

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl p-6 shadow-2xl">
      {/* Top Section: Logo */}
      <div className="flex-none mb-12">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500">
          CivicEarth
        </h1>
      </div>

      {/* Middle Section: Filters */}
      <div className="flex-1 space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Filters</h2>
        {['All', 'CityA', 'CityB'].map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter.toLowerCase())}
            className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
              activeFilter === filter.toLowerCase()
                ? 'bg-blue-600 text-white font-semibold shadow-lg'
                : 'bg-transparent text-gray-400 hover:bg-gray-800'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Bottom Section: Profile */}
      <div className="flex-none mt-12 pt-6 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            {/* User Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="font-semibold text-sm">
            <p className="text-gray-200">{displayName}</p>
            <p className="text-gray-500">{isAuthority ? 'Authority' : 'User'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;