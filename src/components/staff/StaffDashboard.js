import React from 'react';
import StaffLayout from './StaffLayout';
import StaffTasksView from './StaffTasksView';

const StaffDashboard = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <StaffLayout>
        <StaffTasksView />
      </StaffLayout>
    </div>
  );
};

export default StaffDashboard;

