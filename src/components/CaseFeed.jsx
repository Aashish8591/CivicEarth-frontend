import React from 'react';
import CaseCard from './CaseCard';

const dummyCases = [
  {
    id: 1,
    title: 'Illegal Dumping',
    description: 'Someone dumped waste in the river near downtown. Full details here with impact and authorities involved.',
    image: 'https://via.placeholder.com/800x450.png?text=Illegal+Dumping+Image',
    location: 'Downtown, CityA',
    likes: 12,
    comments: 5,
  },
  {
    id: 2,
    title: 'Air Pollution Alert',
    description: 'Factories emitting smoke above safe limits.',
    image: 'https://via.placeholder.com/800x450.png?text=Air+Pollution+Image',
    location: 'Industrial Area, CityB',
    likes: 20,
    comments: 8,
  },
  {
    id: 3,
    title: 'Road Damage',
    description: 'Pothole on Main Street causing traffic disruption. High priority for repair.',
    image: 'https://via.placeholder.com/800x450.png?text=Road+Damage+Image',
    location: 'Main Street, CityA',
    likes: 5,
    comments: 2,
  },
];

const CaseFeed = ({ activeFilter }) => {
  const filteredCases = dummyCases.filter((caseItem) =>
    activeFilter === 'all' ? true : caseItem.location.toLowerCase().includes(activeFilter)
  );

  return (
    <div className="flex flex-col space-y-6">
      {/* Report a Case Section */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-2xl flex items-center justify-between">
        <p className="text-gray-400 text-lg">Report a new case...</p>
        <button className="relative px-6 py-3 rounded-full text-white font-semibold overflow-hidden group">
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 opacity-75 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative z-10">Report</span>
        </button>
      </div>

      {/* Case Cards Feed */}
      {filteredCases.length > 0 ? (
        filteredCases.map((caseItem) => <CaseCard key={caseItem.id} caseData={caseItem} />)
      ) : (
        <div className="text-center text-gray-500 py-12">
          No cases found for this filter.
        </div>
      )}
    </div>
  );
};

export default CaseFeed;