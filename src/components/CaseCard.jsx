import React from 'react';

const CaseCard = ({ caseData }) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl backdrop-filter backdrop-blur-lg bg-opacity-70 border border-gray-700 hover:border-blue-500 transition-all duration-300">
      <img
        src={caseData.image}
        alt={caseData.title}
        className="w-full h-56 object-cover"
      />
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-white">{caseData.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{caseData.description}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{caseData.location}</span>
        </div>
        <div className="flex items-center space-x-6 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm">{caseData.likes}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{caseData.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;