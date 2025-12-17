import React from 'react';

const StatusFilter = ({ value, onChange, counts = {} }) => {
  const statuses = [
    { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-700' },
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'published', label: 'Published', color: 'bg-green-100 text-green-700' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map(status => {
        const count = status.value === 'all' 
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : counts[status.value] || 0;
        
        return (
          <button
            key={status.value}
            onClick={() => onChange(status.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              value === status.value
                ? 'bg-orange-600 text-white'
                : `${status.color} hover:opacity-80`
            }`}
          >
            {status.label}
            {count > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                value === status.value ? 'bg-white/20' : 'bg-black/10'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilter;
