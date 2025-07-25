import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');

  return adminToken ? children : <Navigate to="/admin-login" />;
};

export default AdminRoute;
