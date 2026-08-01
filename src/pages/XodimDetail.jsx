import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import '../styles/xodim-detail.css';

const XodimDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [xodim, setXodim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchXodim();
  }, [id]);

  const fetchXodim = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/user');
      const found = res.find(u => u.id === parseInt(id));
      setXodim(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const rootUrl = 'http://localhost:9000';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${rootUrl}${cleanPath}`;
  };

  const roleToUz = (role) => {
    const roles = {
      'admin': 'Admin',
      'director': 'Direktor',
      'receptionist': 'Reseption',
      'doctor': 'Shifokor',
      'cashier': 'Kassir',
      'nurse': 'Hamshira',
      'lab': 'Laborant'
    };
    return roles[role] || role;
  };

  if (loading) return <MainLayout title="Юкланмоқда..."><div className="loading">Юкланмоқда...</div></MainLayout>;

  if (!xodim) {
    return (
      <MainLayout title="Ходим топилмади">
        <div className="not-found">
          <h2>Ходим топилмади</h2>
          <button className="btn btn-primary" onClick={() => navigate('/xodimlar')}>
            Орқага қайтиш
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={xodim.name}>
      <div className="xodim-detail">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate('/xodimlar')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Орқага
          </button>
        </div>

        <div className="xodim-profile-section">
          <div className="xodim-avatar-large">
            {xodim.photo ? (
              <img src={getImageUrl(xodim.photo)} alt={xodim.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              xodim.name.split(' ').map(n => n[0]).join('')
            )}
          </div>
          <div className="xodim-main-info">
            <h1>{xodim.name}</h1>
            <p className="xodim-lavozim">{roleToUz(xodim.role)}</p>
            <p className="xodim-filial">{xodim.Branch?.name}</p>
          </div>
          <span className={`status-badge success`}>
            Ишда
          </span>
        </div>

        <div className="xodim-stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">09:00</span>
              <span className="stat-label">Иш бошлаш</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">0</span>
              <span className="stat-label">Хизмат кўрсатилган</span>
            </div>
          </div>
        </div>

        <div className="xodim-sections">
          <div className="section-card salary-section">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Контакт маълумотлари
            </h2>
            <div className="salary-grid">
              <div className="salary-item">
                <span className="salary-label">Телефон</span>
                <span className="salary-value">+998 {xodim.username}</span>
              </div>
              <div className="salary-item">
                <span className="salary-label">Роль</span>
                <span className="salary-value">{xodim.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default XodimDetail;
