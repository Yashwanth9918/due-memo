import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage'; // Correct path
import VendorPage from '../pages/VendorPage'; // Correct path
import CustomerPage from '../pages/CustomerPage'; // Correct path

const Routers = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/vendor' element={<VendorPage />} />
      <Route path='/customer' element={<CustomerPage />} />
    </Routes> 
  );
}

export default Routers;