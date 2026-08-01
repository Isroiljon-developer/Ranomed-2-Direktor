import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import '../styles/pages.css';

const Shikoyatlar = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('barchasi');
  const filialId = localStorage.getItem('filialId');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/complaint?filialId=${filialId}`);
      setComplaints(res || []);
    } catch (err) {
      console.error('Fetch complaints error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredShikoyatlar = complaints.filter(s => {
    if (filter === 'korilmagan') return s.status === 'pending';
    if (filter === 'korilgan') return s.status === 'resolved' || s.status === 'seen';
    return true;
  });

  const korilmagan = complaints.filter(s => s.status === 'pending').length;

  const handleViewComplaint = (id) => {
    navigate(`/shikoyatlar/${id}`);
  };

  return (
    <MainLayout title="Шикоятлар">
      <div className="page-header">
        <h1>Шикоятлар</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="badge badge-danger" style={{ padding: '8px 16px', fontSize: '14px' }}>
            {korilmagan} та кўрилмаган
          </span>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <span className="filter-label">Ҳолат:</span>
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="barchasi">Барчаси</option>
            <option value="korilmagan">Кўрилмаган</option>
            <option value="korilgan">Кўрилган</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Юкланмоқда...</div>
      ) : (
        <div className="card">
          {filteredShikoyatlar.map(shikoyat => (
            <div
              key={shikoyat.id}
              className={`complaint-item ${shikoyat.status === 'pending' ? 'unread' : 'read'}`}
              onClick={() => handleViewComplaint(shikoyat.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="complaint-status-icon">
                {shikoyat.status === 'pending' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                )}
              </div>
              <div className="complaint-content">
                <div className="complaint-header">
                  <span className="complaint-patient">{shikoyat.Patient?.ism || 'Аноним'}</span>
                  <span className="complaint-date">{new Date(shikoyat.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="complaint-text">{shikoyat.text}</div>
                <div className="complaint-meta">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                    </svg>
                    {shikoyat.Branch?.name || 'Берилмаган'}
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    {shikoyat.doctor?.name || 'Боғланмаган'}
                  </span>
                  <span className={`badge ${shikoyat.status === 'pending' ? 'badge-danger' : 'badge-success'}`}>
                    {shikoyat.status === 'pending' ? 'Кўрилмаган' : 'Кўрилган'}
                  </span>
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ flexShrink: 0 }}
                onClick={(e) => { e.stopPropagation(); handleViewComplaint(shikoyat.id); }}
              >
                Кўриш
              </button>
            </div>
          ))}
          {filteredShikoyatlar.length === 0 && (
            <div className="empty-message" style={{ padding: '40px', textAlign: 'center' }}>
              Шикоятлар топилмади
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default Shikoyatlar;
