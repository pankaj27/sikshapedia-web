import React from 'react';
import { FiEdit2, FiClock, FiCheck, FiX } from 'react-icons/fi';

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-700',
    icon: FiEdit2,
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700',
    icon: FiClock,
  },
  published: {
    label: 'Published',
    color: 'bg-green-100 text-green-700',
    icon: FiCheck,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700',
    icon: FiX,
  }
};

const StatusBadge = ({ status = 'draft', size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const Icon = config.icon;
  
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}>
      <Icon size={size === 'xs' ? 10 : size === 'sm' ? 12 : 14} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
