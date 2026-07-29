import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-pulse">
      <div className="h-16 bg-surface border border-gray-800 rounded-xl"></div>
      
      <div className="h-24 bg-surface border border-gray-800 rounded-xl"></div>
      
      <div className="space-y-4">
        <div className="h-8 w-64 bg-surface rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-20 bg-surface border border-gray-800 rounded-xl"></div>
          <div className="h-20 bg-surface border border-gray-800 rounded-xl"></div>
          <div className="h-20 bg-surface border border-gray-800 rounded-xl"></div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="h-8 w-48 bg-surface rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-24 bg-surface border border-gray-800 rounded-xl"></div>
          <div className="h-24 bg-surface border border-gray-800 rounded-xl"></div>
          <div className="h-24 bg-surface border border-gray-800 rounded-xl"></div>
          <div className="h-24 bg-surface border border-gray-800 rounded-xl"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-48 bg-surface border border-gray-800 rounded-xl"></div>
        <div className="h-48 bg-surface border border-gray-800 rounded-xl"></div>
      </div>
    </div>
  );
};
