// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      <h1>Welcome to the Home Page</h1>
      <p>This is the landing page of the application. Please log in to access your dashboard.</p>
      <Link to="/login" className="btn btn-primary">
        Go to Login
      </Link>
    </div>
  );
};

export default Home;
