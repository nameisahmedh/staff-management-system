import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminTasksView from './AdminTasksView';
import AdminStaffView from './AdminStaffView';
import MoodAnalytics from './MoodAnalytics';
import TaskReminders from './TaskReminders';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <AdminLayout>
        <Routes>
          <Route index element={<AdminTasksView />} />
          <Route path="tasks" element={<AdminTasksView />} />
          <Route path="allocate" element={<AdminTasksView showFormOnly={true} />} />
          <Route path="staff" element={<AdminStaffView />} />
          <Route path="mood-analytics" element={<MoodAnalytics />} />
          <Route path="reminders" element={<TaskReminders />} />
        </Routes>
      </AdminLayout>
    </div>
  );
};

export default AdminDashboard;
