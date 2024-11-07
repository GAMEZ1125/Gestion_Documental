// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar'; // Importar el Navbar
import { Outlet } from 'react-router-dom'; // Componente para renderizar rutas hijas

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Outlet /> {/* Aquí se renderizan las rutas hijas */}
      </div>
    </>
  );
};

export default Layout;
