import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import '../styles/pages.css';

const TelegramTahlil = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const filialId = localStorage.getItem('filialId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, appRes] = await Promise.all([
        api.get(`/admin/stats?filialId=${filialId}`),
        api.get(`/admin/appointment?filialId=${filialId}`)
      ]);
      setStats(statsRes);
      // Filter for telegram source
      if (appRes) {
        setAppointments(appRes.filter(a => a.source === 'telegram'));
      }
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return 'badge-success';
      case 'waiting': return 'badge-warning';
      case 'completed': return 'badge-info';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  // Prepare chart data from real appointments
  const holatData = [
    { name: 'Тасдиқланган', value: appointments.filter(a => a.status === 'confirmed').length, color: '#43a047' },
    { name: 'Кутилмоқда', value: appointments.filter(a => a.status === 'waiting').length, color: '#f57c00' },
    { name: 'Тугалланган', value: appointments.filter(a => a.status === 'completed').length, color: '#1e88e5' },
    { name: 'Бекор қилинган', value: appointments.filter(a => a.status === 'cancelled').length, color: '#e53935' },
  ].filter(d => d.value > 0);

  // If no data, show empty state for pie chart
  if (holatData.length === 0) {
    holatData.push({ name: 'Маълумот йўқ', value: 1, color: '#e5e7eb' });
  }

  // Group by day for simple haftalik trend
  const days = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
  const haftalikTrend = days.map(day => ({ kun: day, soni: 0 }));
  // Just for demonstration, we could group by date if we had enough data

  return (
    <MainLayout title="Телеграм таҳлил">
      <div className="page-header">
        <h1>Телеграм бот статистикаси</h1>
      </div>

      {loading ? (
        <div className="loading-container">Юкланмоқда...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="finance-stats">
            <div className="finance-stat-card total">
              <div className="finance-stat-label">Телеграм навбатлар</div>
              <div className="finance-stat-value">{stats?.telegramCount || 0}</div>
            </div>
            <div className="finance-stat-card">
              <div className="finance-stat-label">Бугунги навбатлар</div>
              <div className="finance-stat-value">{stats?.appointmentsCount || 0}</div>
            </div>
            <div className="finance-stat-card profit">
              <div className="finance-stat-label">Янги беморлар</div>
              <div className="finance-stat-value">{stats?.todayPatients || 0}</div>
            </div>
          </div>

          <div className="charts-grid" style={{ marginBottom: '24px' }}>
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Навбатлар ҳолати</h3>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={holatData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {holatData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} та`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Метод</h3>
              </div>
              <div className="chart-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', color: '#3b82f6', fontWeight: 'bold' }}>
                    {stats?.telegramCount || 0}
                  </div>
                  <p style={{ color: '#6b7280' }}>Телеграм орқали келган жами навбатлар</p>
                </div>
              </div>
            </div>
          </div>

          {/* Telegram bemorlar jadvali */}
          <div className="card">
            <div className="card-header">
              <h3 className="chart-title">Телеграм орқали навбат олганлар</h3>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Бемор</th>
                    <th>Шифокор</th>
                    <th>Сана</th>
                    <th>Вақт</th>
                    <th>Ҳолат</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((navbat, index) => (
                    <tr key={navbat.id}>
                      <td>{index + 1}</td>
                      <td><strong>{navbat.Patient?.ism || 'Noma\'lum'}</strong></td>
                      <td>{navbat.doctor?.name || 'Шифоkor танланмаган'}</td>
                      <td>{navbat.sana}</td>
                      <td>{navbat.vaqt}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(navbat.status)}`}>
                          {getStatusUz(navbat.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="empty-message">Телеграм орқали навбатлар мавжуд эмас</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default TelegramTahlil;
