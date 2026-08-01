import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ title, onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('filialId');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-right">
        <div className="header-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="ТљРёРґРёСЂРёС€..." />
        </div>

        <div className="header-actions">
          <button className="header-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-dot"></span>
          </button>

          <button className="header-btn" onClick={handleLogout} title="Р§РёТ›РёС€">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        <div className="user-profile">
          <div className="user-avatar">Р”Рњ</div>
          <div className="user-info">
            <span className="user-name">Р”РёСЂРµРєС‚РѕСЂ</span>
            <span className="user-role">Р‘РѕС€ РґРёСЂРµРєС‚РѕСЂ</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

