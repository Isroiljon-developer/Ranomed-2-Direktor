import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import '../styles/bemor-detail.css';

const BemorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bemor, setBemor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBemor();
  }, [id]);

  const fetchBemor = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/patient/${id}`);
      setBemor(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return 0;
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (loading) return <MainLayout title="Юкланмоқда..."><div className="loading">Юкланмоқда...</div></MainLayout>;

  if (!bemor) {
    return (
      <MainLayout title="Бемор топилмади">
        <div className="not-found">
          <h2>Бемор топилмади</h2>
          <button className="btn btn-primary" onClick={() => navigate('/bemorlar')}>
            Орқага қайтиш
          </button>
        </div>
      </MainLayout>
    );
  }

  // Bemor tarixi (mock or fetch from /visit?patientId=... if exists)
  const tarix = [];

  return (
    <MainLayout title={bemor.ism}>
      <div className="bemor-detail">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate('/bemorlar')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Орқага
          </button>
        </div>

        <div className="bemor-profile-section">
          <div className="bemor-avatar-large">
            {bemor.ism.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="bemor-main-info">
            <h1>{bemor.ism}</h1>
            <p className="bemor-meta">
              <span>{calculateAge(bemor.tugilganSana)} ёш</span>
              <span className="separator">•</span>
              <span>{bemor.jinsi}</span>
            </p>
            <p className="bemor-phone">{bemor.telefon}</p>
          </div>
        </div>

        <div className="bemor-info-grid">
          <div className="info-card">
            <div className="info-card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
              </svg>
              <h3>Филиал</h3>
            </div>
            <p>{bemor.Branch?.name}</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h3>Манзил</h3>
            </div>
            <p>{bemor.manzil || 'Кўрсатилмаган'}</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3>Рўйхатдан ўтган</h3>
            </div>
            <p>{new Date(bemor.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bemor-history-section">
          <h2>Ташриф тарихи</h2>
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Сана</th>
                    <th>Ҳолат</th>
                  </tr>
                </thead>
                <tbody>
                  {tarix.length > 0 ? tarix.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.sana}</td>
                      <td>
                        <span className={`badge badge-success`}>
                          {item.holat}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="2" className="empty-message">Ташриф тарихи мавжуд эмас</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BemorDetail;
