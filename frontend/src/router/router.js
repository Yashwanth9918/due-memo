import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage'; // Correct path
import VendorPage from '../pages/VendorPage'; // Correct path
import CustomerPage from '../pages/CustomerPage'; // Correct path
import Login from '../pages/Login';
import SignUpPage from '../pages/SignUpPage';
import SignUP from '../pages/SignUp';

const Routers = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/vendor' element={<VendorPage />} />
      <Route path='/customer' element={<CustomerPage />} />
      <Route path='/login/customer' element={<Login userType='customer'/>}/>
      <Route path='/login/vendor' element={<Login userType='vendor'/>}/>
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/signup/customer' element={<SignUP userType='customer'/>}/>
      <Route path='/signup/vendor' element={<SignUP userType='vendor'/>}/>
    </Routes> 
  );
}

export default Routers;