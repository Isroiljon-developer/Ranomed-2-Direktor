import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import '../styles/shifokor-detail.css';

const ShifokorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('umumiy');
  const [shifokor, setShifokor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShifokor();
  }, [id]);

  const fetchShifokor = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/user`);
      // Since there is no direct get by id in admin.route.js, we filter from all users or assume the backend supports it.
      // Looking at admin.route.js, there is no GET /user/:id. Let's use GET /user and filter for now, 
      // or check if I should add a backend route.
      const found = res.find(u => u.id === parseInt(id));
      setShifokor(found);
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

  if (loading) return <MainLayout title="Юкланмоқда..."><div className="loading">Юкланмоқда...</div></MainLayout>;

  if (!shifokor) {
    return (
      <MainLayout title="Шифокор топилмади">
        <div className="not-found">
          <h2>Шифокор топилмади</h2>
          <button className="btn btn-primary" onClick={() => navigate('/shifokorlar')}>
            Орқага қайтиш
          </button>
        </div>
      </MainLayout>
    );
  }

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('') : '?';
  };

  // Mock stats for now as backend doesn't provide these details in a single pull
  const oylikStatistika = [
    { oy: 'Yan', bemorlar: 0, tushum: 0 },
    { oy: 'Fev', bemorlar: 0, tushum: 0 },
    { oy: 'Mar', bemorlar: 0, tushum: 0 },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'waiting': { class: 'badge-warning', text: 'Кутилмоқда' },
      'active': { class: 'badge-info', text: 'Қабулда' },
      'completed': { class: 'badge-success', text: 'Якунланган' },
      'cancelled': { class: 'badge-danger', text: 'Бекор' }
    };
    return statusMap[status] || { class: 'badge-secondary', text: status };
  };

  return (
    <MainLayout title={shifokor.name}>
      <div className="shifokor-detail">
        <button className="back-button" onClick={() => navigate('/shifokorlar')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Орқага
        </button>

        <div className="shifokor-profile-card">
          <div className="profile-header">
            <div className="profile-avatar large">
              {shifokor.photo ? (
                <img src={getImageUrl(shifokor.photo)} alt={shifokor.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                getInitials(shifokor.name)
              )}
            </div>
            <div className="profile-info">
              <h1>{shifokor.name}</h1>
              <p className="specialty">{shifokor.specialization || 'Шифокор'}</p>
              <p className="filial">{shifokor.Branch?.name}</p>
              <div className="profile-rating">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>4.8</span>
              </div>
            </div>
          </div>

          <div className="profile-contacts">
            <div className="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
              </svg>
              <span>+998 {shifokor.username}</span>
            </div>
            <div className="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>{shifokor.role}</span>
            </div>
          </div>
        </div>

        <div className="shifokor-stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">0</div>
              <div className="stat-label">Жами беморлар</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">0K</div>
              <div className="stat-label">Жами тушум</div>
            </div>
          </div>
        </div>

        <div className="shifokor-tabs">
          <button
            className={`tab-btn ${activeTab === 'umumiy' ? 'active' : ''}`}
            onClick={() => setActiveTab('umumiy')}
          >
            Умумий статистика
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'umumiy' && (
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Ойлик беморлар ва тушум</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={oylikStatistika}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="oy" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="bemorlar" stroke="#3b82f6" strokeWidth={2} name="Беморлар" />
                    <Line yAxisId="right" type="monotone" dataKey="tushum" stroke="#10b981" strokeWidth={2} name="Тушум (млн)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ShifokorDetail;
