import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import '../styles/pages.css';

const Navbatlar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const filialId = localStorage.getItem('filialId');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/appointment?filialId=${filialId}`);
      setAppointments(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusUz = (status) => {
    const statuses = {
      'waiting': 'Кутмоқда',
      'confirmed': 'Тасдиқланган',
      'completed': 'Тугатилган',
      'cancelled': 'Бекор қилинган'
    };
    return statuses[status] || status;
  };

  const kutmoqdalar = appointments.filter(n => n.status === 'waiting' || n.status === 'confirmed').length;
  const tugatilganlar = appointments.filter(n => n.status === 'completed').length;

  return (
    <MainLayout title="Навбатлар">
      <div className="page-header">
        <h1>Навбатлар назорати</h1>
      </div>

      {loading ? (
        <div className="loading-container">Юкланмоқда...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="finance-stats">
            <div className="finance-stat-card total">
              <div className="finance-stat-label">Жами навбатлар</div>
              <div className="finance-stat-value">{appointments.length}</div>
            </div>
            <div className="finance-stat-card">
              <div className="finance-stat-label">Фаол навбатлар</div>
              <div className="finance-stat-value">{kutmoqdalar}</div>
            </div>
            <div className="finance-stat-card profit">
              <div className="finance-stat-label">Тугатилган</div>
              <div className="finance-stat-value">{tugatilganlar}</div>
            </div>
            <div className="finance-stat-card">
              <div className="finance-stat-label">Ўртача кутиш</div>
              <div className="finance-stat-value">15 дақ</div>
            </div>
          </div>

          <div className="queue-list">
            {appointments.map(navbat => (
              <div key={navbat.id} className="queue-item">
                <div className="queue-number">#{navbat.navbat}</div>
                <div className="queue-info">
                  <div className="queue-patient">{navbat.Patient?.ism || 'Noma\'lum'}</div>
                  <div className="queue-doctor">
                    {navbat.doctor?.name || 'Шифокор танланмаган'} • {navbat.doctor?.specialization || 'Шифокор'}
                  </div>
                </div>
                <div className="queue-time">{navbat.sana} | {navbat.vaqt}</div>
                <span className={`queue-status ${navbat.status === 'waiting' ? 'waiting' : navbat.status === 'completed' ? 'completed' : 'active'}`}>
                  {getStatusUz(navbat.status)}
                </span>
                {navbat.source === 'telegram' && (
                  <span className="source-badge">Telegram</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Navbatlar;
