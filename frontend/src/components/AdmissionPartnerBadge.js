/**
 * AdmissionPartnerBadge - Shows admission open badge for partner institutions
 */
import React from 'react';
import { FiCheck, FiCalendar } from 'react-icons/fi';

const AdmissionPartnerBadge = ({ 
  isPartner, 
  isAdmissionOpen = true, 
  deadline = null,
  size = 'default', // 'small', 'default', 'large'
  onClick = null,
  showBookButton = false
}) => {
  if (!isPartner) return null;

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2'
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Main Badge */}
      <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium ${sizeClasses[size]}`}>
        <FiCheck size={size === 'small' ? 12 : 16} />
        <span>Admission Partner</span>
      </div>
      
      {/* Admission Open Badge */}
      {isAdmissionOpen && (
        <div 
          className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium cursor-pointer hover:shadow-lg transition-all ${sizeClasses[size]} ${onClick ? 'hover:scale-105' : ''}`}
          onClick={onClick}
        >
          <span className="animate-pulse">🔥</span>
          <span>Admission Open - Book Your Seat</span>
        </div>
      )}
      
      {/* Deadline if available */}
      {deadline && (
        <div className={`inline-flex items-center gap-1.5 text-gray-600 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
          <FiCalendar size={12} />
          <span>Deadline: {deadline}</span>
        </div>
      )}
    </div>
  );
};

export default AdmissionPartnerBadge;
