import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Facebook, Twitter, Instagram } from 'react-bootstrap-icons';

const SignUpPage = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="card p-4 shadow-lg" style={{ width: '400px', borderRadius: '20px', textAlign: 'center' }}>
        <h1 className="mb-4 fw-bold" style={{ fontSize: '24px' }}>DUE-MEMO</h1>

        <div className="mb-4">
          <button className="btn btn-outline-dark btn-lg w-100 mb-2" onClick={() => navigate('/signup/customer')}>
            Sign-up as a Customer
          </button>
          <button className="btn btn-outline-dark btn-lg w-100" onClick={() => navigate('/signup/vendor')}>
            Sign-up as a Vendor
          </button>
        </div>

        <p className="text-muted mt-3">
          If already a user, <span style={{ color: "#343a40", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate("/login")}>Login!</span>
        </p>
        <button className="btn btn-dark btn-lg w-100 mb-4" onClick={() => navigate('/login')}>
          Login
        </button>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-light border rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
            <Facebook size={20} />
          </button>
          <button className="btn btn-light border rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
            <Twitter size={20} />
          </button>
          <button className="btn btn-light border rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
            <Instagram size={20} />
          </button>
        </div>

        <footer className="mt-4 text-muted" style={{ fontSize: '14px' }}>
          <p>abc123@gmail.com</p>
        </footer>
      </div>
    </div>
  );
};

export default SignUpPage;
