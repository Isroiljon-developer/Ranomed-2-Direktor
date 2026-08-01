import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import '../styles/shikoyat-detail.css';

const ShikoyatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shikoyat, setShikoyat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/complaint/${id}`);
      setShikoyat(res);
    } catch (err) {
      console.error('Fetch complaint error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await api.put(`/complaint/${id}`, { status: 'resolved' });
      navigate('/shikoyatlar');
    } catch (err) {
      alert('Xatolik yuz berdi');
    }
  };

  if (loading) return <MainLayout title="Юкланмоқда..."><div className="loading-container">Юкланмоқда...</div></MainLayout>;

  if (!shikoyat) {
    return (
      <MainLayout title="Шикоят топилмади">
        <div className="not-found">
          <h2>Шикоят топилмади</h2>
          <button className="btn btn-primary" onClick={() => navigate('/shikoyatlar')}>
            Орқага қайтиш
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Шикоят">
      <div className="shikoyat-detail">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate('/shikoyatlar')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Орқага
          </button>
        </div>

        <div className="shikoyat-card">
          <div className="shikoyat-header">
            <div className="shikoyat-status-icon">
              {shikoyat.status === 'pending' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
            </div>
            <div className="shikoyat-title-info">
              <h1>Шикоят #{shikoyat.id}</h1>
              <span className={`status-badge ${shikoyat.status === 'pending' ? 'danger' : 'success'}`}>
                {shikoyat.status === 'pending' ? 'Кўрилмаган' : 'Кўрилган'}
              </span>
            </div>
            <span className="shikoyat-date">{new Date(shikoyat.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="shikoyat-content">
            <div className="shikoyat-text-section">
              <h3>Шикоят матни</h3>
              <p className="shikoyat-text">{shikoyat.text}</p>
            </div>

            <div className="shikoyat-info-grid">
              <div className="info-block">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <div className="info-content">
                  <span className="info-label">Бемор</span>
                  <span className="info-value">{shikoyat.Patient?.ism || 'Аноним'}</span>
                  <span className="info-sub">{shikoyat.Patient?.telefon}</span>
                </div>
              </div>

              <div className="info-block">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                  </svg>
                </div>
                <div className="info-content">
                  <span className="info-label">Ф филиал</span>
                  <span className="info-value">{shikoyat.Branch?.name || 'Берилмаган'}</span>
                </div>
              </div>

              <div className="info-block">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div className="info-content">
                  <span className="info-label">Шифокор</span>
                  <span className="info-value">{shikoyat.doctor?.name || 'Боғланмаган'}</span>
                  <span className="info-sub">{shikoyat.doctor?.specialization || 'Мутахассис'}</span>
                </div>
              </div>
            </div>
          </div>

          {shikoyat.status === 'pending' && (
            <div className="shikoyat-actions">
              <button className="btn btn-primary" onClick={handleMarkAsRead}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Кўрилган деб белгилаш
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ShikoyatDetail;
