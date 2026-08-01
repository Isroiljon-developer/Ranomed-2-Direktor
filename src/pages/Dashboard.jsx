import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayPatients: 0,
    appointmentsCount: 0,
    telegramCount: 0,
    occupiedWards: 0,
    freeWards: 0,
    revenue: 0,
    todayRevenue: 0,
    monthlyTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const filialId = localStorage.getItem('filialId');

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // 1 minutda bir yangilash
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/admin/stats?filialId=${filialId}`);
      if (res) setStats(res);
      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      icon: 'money',
      value: (stats.todayRevenue || 0).toLocaleString() + ' сўм',
      label: 'Бугунги тушум',
      color: 'blue'
    },
    {
      icon: 'patients',
      value: stats.todayPatients,
      label: 'Бугунги беморlar',
      color: 'green'
    },
    {
      icon: 'queue',
      value: stats.appointmentsCount,
      label: 'Фаол навбатлар',
      color: 'blue'
    },
    {
      icon: 'bed-occupied',
      value: stats.occupiedWards,
      label: 'Банд палаталар',
      color: 'red'
    },
    {
      icon: 'bed-free',
      value: stats.freeWards,
      label: 'Бўш палаталар',
      color: 'green'
    },
    {
      icon: 'telegram',
      value: stats.telegramCount,
      label: 'Телеграм навбатлар',
      color: 'blue'
    },
  ];

  const getKpiIcon = (name) => {
    const icons = {
      money: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      patients: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      queue: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      'bed-occupied': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 4v16M22 4v16M6 12h12M6 12V8h12v4" />
        </svg>
      ),
      'bed-free': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 4v16M22 4v16M6 12h12M6 12V8h12v4" />
        </svg>
      ),
      telegram: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.5 2L2 10.5l7 2.5 3 7.5 3.5-5 5.5 4L21.5 2z" />
        </svg>
      ),
    };
    return icons[name];
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <MainLayout title="Бошқарув панели">
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Хуш келибсиз, Директор!</h1>
            <p>Бугун {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="realtime-indicator">
            <span className="pulse-dot"></span>
            <span>Охирги янгиланиш: {formatTime(lastUpdate)}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">Юкланмоқда...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="kpi-grid">
              {kpiCards.map((card, idx) => (
                <div key={idx} className={`kpi-card ${card.color}`}>
                  <div className="kpi-header">
                    <div className={`kpi-icon ${card.color}`}>
                      {getKpiIcon(card.icon)}
                    </div>
                  </div>
                  <div className="kpi-value">{card.value}</div>
                  <div className="kpi-label">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Молиявий тренд (Ойлик)</h3>
                </div>
                <div className="chart-body">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={stats.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                      <XAxis dataKey="oy" stroke="#6c757d" fontSize={12} />
                      <YAxis
                        stroke="#6c757d"
                        fontSize={12}
                        tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        formatter={(value) => [`${value.toLocaleString()} сўм`, '']}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e9ecef' }}
                      />
                      <Bar dataKey="tushum" name="Тушум" fill="#1e88e5" radius={[4, 4, 0, 0]} barSize={30} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Бошқа кўрсаткичлар</h3>
                </div>
                <div className="chart-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
                  <div className="stat-row">
                    <span>Жами тушум:</span>
                    <strong>{(stats.revenue || 0).toLocaleString()} сўм</strong>
                  </div>
                  <div className="stat-row">
                    <span>Палаталар бандлиги:</span>
                    <strong>{stats.occupiedWards} / {stats.occupiedWards + stats.freeWards}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Телеграм навбатлар:</span>
                    <strong>{stats.telegramCount}</strong>
                  </div>
                </div>
              </div>
            </div>
            {/* Hamshiralar Oylik Navbatchilik Hisoboti */}
            <div className="card-card" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  📋 Hamshiralar Oylik Navbatchilik Hisoboti (Dejurantlar)
                </h3>
                <a href="/hamshiralar-jadvali" style={{ fontSize: '13px', fontWeight: '700', color: '#1d4ed8', textDecoration: 'none' }}>
                  To'liq jadval →
                </a>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Hamshira F.I.O</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Bo'lim</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>☀️ Kunduzgi</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>🌆 Kechki</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#5b21b6', textTransform: 'uppercase' }}>🌙 Tungi</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>🏖️ Dam olish</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>Jami smenalar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const today = new Date();
                      const key = `schedule_${today.getFullYear()}_${today.getMonth()}`;
                      let saved = {};
                      try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e){}
                      const nurses = [
                        { id: 1, name: 'Malika Karimova', dept: 'Kardiologiya' },
                        { id: 2, name: 'Shahnoza Aliyeva', dept: 'Nevrologiya' },
                        { id: 3, name: 'Nargiza Umarova', dept: 'Pediatriya' },
                        { id: 4, name: 'Dilnoza Rahmatova', dept: 'Xirurgiya' }
                      ];
                      return nurses.map(n => {
                        const s = saved[n.id] || {};
                        let counts = { kunduzgi: 0, kechki: 0, tungi: 0, dam_olish: 0, total: 0 };
                        Object.values(s).forEach(val => {
                          if (counts[val] !== undefined) {
                            counts[val]++;
                            if (val !== 'dam_olish') counts.total++;
                          }
                        });
                        return (
                          <tr key={n.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '13px' }}>{n.name}</td>
                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{n.dept}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#1d4ed8' }}>{counts.kunduzgi} kun</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#92400e' }}>{counts.kechki} kun</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight 700, color: '#5b21b6' }}>{counts.tungi} kun</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight 700, color: '#166534' }}>{counts.dam_olish} kun</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{counts.total} smena</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
