import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const AdminStaffView = () => {
  const { users, addUser, updateUser, removeUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    
    const result = await addUser({
      ...formData,
      role: 'staff'
    });
    
    if (result.success) {
      setFormData({ username: '', email: '', phone: '', password: '' });
      showToast('Staff member added.');
    } else {
      showToast(result.error || 'Failed to add staff member', 'error');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm("Are you sure? This will unassign all their tasks.")) {
      return;
    }

    const result = await removeUser(staffId);
    if (result.success) {
      showToast('Staff member deleted.');
    } else {
      showToast('Failed to delete staff member', 'error');
    }
  };

  const [editingStaff, setEditingStaff] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setEditFormData({
      username: staff.username,
      email: staff.email,
      phone: staff.phone,
      password: ''
    });
  };

  const handleUpdateStaff = (e) => {
    e.preventDefault();
    const updateData = {
      username: editFormData.username,
      email: editFormData.email,
      phone: editFormData.phone
    };
    if (editFormData.password) {
      updateData.password = editFormData.password;
    }

    const result = updateUser(editingStaff.id, updateData);
    if (result) {
      showToast('Staff details updated.');
      setEditingStaff(null);
    } else {
      showToast('Failed to update staff details', 'error');
    }
  };

  const handleEditInputChange = (e) => {
    setEditFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const staffMembers = users.filter(u => u.role === 'staff');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-4">
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-responsive-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Staff</h2>
          
          <form onSubmit={handleAddStaff} className="space-responsive">
            <div>
              <label htmlFor="new-staff-username" className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="new-staff-username"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="input-field mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="new-staff-email" className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="new-staff-email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="input-field mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="new-staff-phone" className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                id="new-staff-phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="+1234567890"
              />
            </div>
            
            <div>
              <label htmlFor="new-staff-password" className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">
                Default Password
              </label>
              <input
                type="password"
                id="new-staff-password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="input-field mt-1"
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Add Staff Member
            </button>
          </form>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-responsive-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Staff ({staffMembers.length})</h2>
          
          {editingStaff && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="text-responsive-lg font-semibold mb-4 text-gray-900 dark:text-white">Edit Staff: {editingStaff.username}</h3>
              <form onSubmit={handleUpdateStaff} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={editFormData.username}
                    onChange={handleEditInputChange}
                    className="input-field mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className="input-field mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditInputChange}
                    className="input-field mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-responsive-sm font-medium text-gray-700 dark:text-gray-300">New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={editFormData.password}
                    onChange={handleEditInputChange}
                    className="input-field mt-1"
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 flex gap-2">
                  <button type="submit" className="btn-primary">Update</button>
                  <button type="button" onClick={() => setEditingStaff(null)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          )}
          
          <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
            {staffMembers.length > 0 ? (
              staffMembers.map(staff => (
                <div
                  key={staff.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 gap-2"
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900 dark:text-white text-responsive-base">{staff.username}</p>
                    <p className="text-responsive-sm text-gray-600 dark:text-gray-400">{staff.email}</p>
                    <p className="text-responsive-sm text-gray-600 dark:text-gray-400">{staff.phone}</p>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => handleEditStaff(staff)}
                      className="text-responsive-sm text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="text-responsive-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-responsive-base">No staff members added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStaffView;