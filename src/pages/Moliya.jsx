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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import '../styles/pages.css';

const Moliya = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const filialId = localStorage.getItem('filialId');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/stats?filialId=${filialId}`);
      setStats(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#1e88e5', '#43a047', '#e53935', '#f57c00', '#8e24aa'];

  const oylikData = stats?.monthlyTrend || [];

  const jamiTushum = stats?.revenue || 0;
  const jamiXarajat = oylikData.reduce((a, b) => a + (b.xarajat || 0), 0);
  const jamiFoyda = jamiTushum - jamiXarajat;

  return (
    <MainLayout title="Молия">
      <div className="page-header">
        <h1>Молиявий ҳисобот</h1>
      </div>

      {loading ? (
        <div className="loading-container">Юкланмоқда...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="finance-stats">
            <div className="finance-stat-card total">
              <div className="finance-stat-label">Жами тушум</div>
              <div className="finance-stat-value">
                {(jamiTushum).toLocaleString()}
              </div>
              <div className="finance-stat-sub">сўм</div>
            </div>
            <div className="finance-stat-card" style={{ background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)', color: 'white' }}>
              <div className="finance-stat-label">Жами харажатлар</div>
              <div className="finance-stat-value">
                {(jamiXarajat).toLocaleString()}
              </div>
              <div className="finance-stat-sub">сўм</div>
            </div>
            <div className="finance-stat-card profit">
              <div className="finance-stat-label">Соф фойда</div>
              <div className="finance-stat-value">
                {(jamiFoyda).toLocaleString()}
              </div>
              <div className="finance-stat-sub">сўм</div>
            </div>
            <div className="finance-stat-card">
              <div className="finance-stat-label">Бугунги тушум</div>
              <div className="finance-stat-value">
                {(stats?.todayRevenue || 0).toLocaleString()}
              </div>
              <div className="finance-stat-sub">сўм</div>
            </div>
          </div>

          {/* Йиллик тренд */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3 className="chart-title">Молиявий тренд (Ойлар кесимида)</h3>
            </div>
            <div style={{ height: '350px', padding: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={oylikData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis dataKey="oy" stroke="#6c757d" fontSize={12} />
                  <YAxis stroke="#6c757d" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString()} сўм`, '']}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e9ecef' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="tushum" name="Тушум" fill="#1e88e5" fillOpacity={0.2} stroke="#1e88e5" strokeWidth={2} />
                  <Bar dataKey="xarajat" name="Хараajat" fill="#e53935" radius={[4, 4, 0, 0]} barSize={20} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="charts-grid" style={{ marginBottom: '24px' }}>
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Даромад тақсимоти</h3>
              </div>
              <div className="chart-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e88e5' }}>
                  {(jamiTushum).toLocaleString()} сўм
                </div>
                <p style={{ color: '#6b7280', marginTop: '8px' }}>Жами тўланган маблағлар</p>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Рентабеллик</h3>
              </div>
              <div className="chart-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '10px solid #43a047',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#43a047'
                }}>
                  {jamiTushum > 0 ? ((jamiFoyda / jamiTushum) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Moliya;
