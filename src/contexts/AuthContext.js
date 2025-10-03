import React, { createContext, useContext, useState, useEffect } from 'react';
import database from '../services/databaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState([]);

  const initializeUsers = () => {
    const usersData = database.getUsers();
    setUsers(usersData);
  };

  const checkSession = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (user) {
      const usersData = database.getUsers();
      const validUser = usersData.find(u => u.id === user.id && u.email === user.email);
      if (validUser) {
        setLoggedInUser(validUser);
        localStorage.setItem('loggedInUser', JSON.stringify(validUser));
      } else {
        localStorage.removeItem('loggedInUser');
      }
    }
  };

  useEffect(() => {
    initializeUsers();
  }, []);
  
  useEffect(() => {
    if (users.length > 0) {
      checkSession();
    }
  }, [users]);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setLoggedInUser(user);
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
    window.location.href = '/';
  };

  const addUser = (userData) => {
    if (users.some(u => u.email === userData.email || u.username === userData.username)) {
      return { success: false, error: 'A user with this email or username already exists.' };
    }
    
    const newUser = database.addUser({
      ...userData, 
      username: userData.username || userData.email.split('@')[0]
    });
    
    setUsers(database.getUsers());
    return { success: true, user: newUser };
  };

  const updateUser = (userId, userData) => {
    const updatedUser = database.updateUser(userId, userData);
    if (updatedUser) {
      setUsers(database.getUsers());
      
      // Update logged in user if it's the same user
      if (loggedInUser && loggedInUser.id === userId) {
        const updatedLoggedInUser = { ...loggedInUser, ...userData };
        setLoggedInUser(updatedLoggedInUser);
        localStorage.setItem('loggedInUser', JSON.stringify(updatedLoggedInUser));
      }
      
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  const removeUser = (userId) => {
    const success = database.deleteUser(userId);
    if (success) {
      setUsers(database.getUsers());
      return { success: true };
    }
    return { success: false, error: 'Failed to delete user' };
  };

  const value = {
    loggedInUser,
    users,
    login,
    logout,
    addUser,
    updateUser,
    removeUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

