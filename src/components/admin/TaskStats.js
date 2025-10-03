import React from 'react';

const TaskStats = ({ stats, onFilterChange, activeFilter }) => {
  const statCards = [
    { key: 'all', label: 'Total', value: stats.total, bg: 'bg-slate-200' },
    { key: 'pending', label: 'Pending', value: stats.pending, bg: 'bg-amber-200' },
    { key: 'inProgress', label: 'In Progress', value: stats.inProgress, bg: 'bg-sky-200' },
    { key: 'completed', label: 'Completed', value: stats.completed, bg: 'bg-emerald-200' },
    { key: 'overdue', label: 'Overdue', value: stats.overdue, bg: 'bg-rose-200' }
  ];

  return (
    <>

      <div className="sticky top-32 sm:top-36 z-30 bg-white dark:bg-gray-900 pb-4 mb-4 sm:mb-6 -mx-4 px-4">
        <div className="stats-grid">
        {statCards.map(card => (
          <div 
            key={card.key}
            onClick={() => onFilterChange?.(card.key)}
            className={`${card.bg} p-2 sm:p-3 md:p-4 rounded-md sm:rounded-lg text-center cursor-pointer border transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              activeFilter === card.key 
                ? 'border-black scale-105 shadow-lg' 
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-black transition-all duration-300 hover:scale-110">{card.value}</p>
            <p className="text-xs sm:text-sm text-black opacity-80 hover:opacity-100 transition-opacity duration-300">{card.label}</p>
          </div>
        ))}
        </div>
      </div>
    </>
  );
};

export default TaskStats;
