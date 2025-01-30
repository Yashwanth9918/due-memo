import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage'; // Correct path
import VendorPage from '../pages/VendorPage'; // Correct path
import CustomerPage from '../pages/CustomerPage'; // Correct path
import Login from '../pages/Login';

const Routers = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/vendor' element={<VendorPage />} />
      <Route path='/customer' element={<CustomerPage />} />
      <Route path='/login/customer' element={<Login userType='customer'/>}/>
      <Route path='/login/vendor' element={<Login userType='vendor'/>}/>
    </Routes> 
  );
}

export default Routers;