import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Filiallar from './pages/Filiallar';
import FilialDetail from './pages/FilialDetail';
import Moliya from './pages/Moliya';
import Shifokorlar from './pages/Shifokorlar';
import ShifokorDetail from './pages/ShifokorDetail';
import Xodimlar from './pages/Xodimlar';
import XodimDetail from './pages/XodimDetail';
import HamshiralarJadvali from './pages/HamshiralarJadvali';
import Bemorlar from './pages/Bemorlar';
import BemorDetail from './pages/BemorDetail';
import Palatalar from './pages/Palatalar';
import Navbatlar from './pages/Navbatlar';
import TelegramTahlil from './pages/TelegramTahlil';
import Shikoyatlar from './pages/Shikoyatlar';
import ShikoyatDetail from './pages/ShikoyatDetail';
import Bolimlar from './pages/Bolimlar';
import Sozlamalar from './pages/Sozlamalar';
import Profil from './pages/Profil';
import './styles/global.css';

// Boshqa paneldan redirect bo'lib kelsa URL'dagi tokenni o'qib saqlash
(function readTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('_token');
  const user = params.get('_user');
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    if (user) {
      try {
        const u = JSON.parse(user);
        localStorage.setItem('user', user);
        if (u.filialId) localStorage.setItem('filialId', u.filialId);
      } catch(e) {}
    }
    window.history.replaceState({}, '', window.location.pathname);
  }
})();

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.href = 'http://localhost:5173/login';
    return null;
  }
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {/* <Route path="/filiallar" element={<ProtectedRoute><Filiallar /></ProtectedRoute>} />
        <Route path="/filiallar/:id" element={<ProtectedRoute><FilialDetail /></ProtectedRoute>} /> */}
        <Route path="/moliya" element={<ProtectedRoute><Moliya /></ProtectedRoute>} />
        <Route path="/shifokorlar" element={<ProtectedRoute><Shifokorlar /></ProtectedRoute>} />
        <Route path="/shifokorlar/:id" element={<ProtectedRoute><ShifokorDetail /></ProtectedRoute>} />
        <Route path="/xodimlar" element={<ProtectedRoute><Xodimlar /></ProtectedRoute>} />
        <Route path="/xodimlar/:id" element={<ProtectedRoute><XodimDetail /></ProtectedRoute>} />
        <Route path="/hamshiralar-jadvali" element={<ProtectedRoute><HamshiralarJadvali /></ProtectedRoute>} />
        <Route path="/bemorlar" element={<ProtectedRoute><Bemorlar /></ProtectedRoute>} />
        <Route path="/bemorlar/:id" element={<ProtectedRoute><BemorDetail /></ProtectedRoute>} />
        <Route path="/palatalar" element={<ProtectedRoute><Palatalar /></ProtectedRoute>} />
        <Route path="/navbatlar" element={<ProtectedRoute><Navbatlar /></ProtectedRoute>} />
        <Route path="/telegram" element={<ProtectedRoute><TelegramTahlil /></ProtectedRoute>} />
        <Route path="/shikoyatlar" element={<ProtectedRoute><Shikoyatlar /></ProtectedRoute>} />
        <Route path="/shikoyatlar/:id" element={<ProtectedRoute><ShikoyatDetail /></ProtectedRoute>} />
        <Route path="/bolimlar" element={<ProtectedRoute><Bolimlar /></ProtectedRoute>} />
        <Route path="/sozlamalar" element={<ProtectedRoute><Sozlamalar /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
