import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import '../styles/pages.css';

const Bemorlar = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const filialId = localStorage.getItem('filialId');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/patient?filialId=${filialId}`);
      if (res) setPatients(res);
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

  // Jins bo'yicha
  const erkaklar = patients.filter(b => b.jinsi === 'male' || b.jinsi === 'Эркак').length;
  const ayollar = patients.filter(b => b.jinsi === 'female' || b.jinsi === 'Аёл').length;
  const jinsData = [
    { name: 'Эркаклар', value: erkaklar },
    { name: 'Аёллар', value: ayollar }
  ];

  // Yosh bo'yicha
  const yoshData = [
    { yosh: '0-18', soni: patients.filter(b => calculateAge(b.tugilganSana) <= 18).length },
    { yosh: '19-35', soni: patients.filter(b => calculateAge(b.tugilganSana) > 18 && calculateAge(b.tugilganSana) <= 35).length },
    { yosh: '36-50', soni: patients.filter(b => calculateAge(b.tugilganSana) > 35 && calculateAge(b.tugilganSana) <= 50).length },
    { yosh: '51-65', soni: patients.filter(b => calculateAge(b.tugilganSana) > 50 && calculateAge(b.tugilganSana) <= 65).length },
    { yosh: '65+', soni: patients.filter(b => calculateAge(b.tugilganSana) > 65).length },
  ];

  const COLORS = ['#1e88e5', '#e53935', '#43a047', '#f57c00'];

  const handleBemorClick = (id) => {
    navigate(`/bemorlar/${id}`);
  };

  return (
    <MainLayout title="Беморлар таҳлили">
      <div className="page-header">
        <h1>Беморлар таҳлили</h1>
      </div>

      {loading ? (
        <div className="loading-container">Юкланмоқда...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="finance-stats">
            <div className="finance-stat-card total">
              <div className="finance-stat-label">Жами беморлар</div>
              <div className="finance-stat-value">{patients.length}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid" style={{ marginBottom: '24px' }}>
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Жинс бўйича</h3>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jinsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#1e88e5" />
                      <Cell fill="#e53935" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Ёш бўйича</h3>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yoshData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="yosh" stroke="#6c757d" fontSize={12} />
                    <YAxis stroke="#6c757d" fontSize={12} />
                    <Tooltip
                      formatter={(value) => [`${value} нафар`, 'Беморлар']}
                      contentStyle={{ borderRadius: 8, border: '1px solid #e9ecef' }}
                    />
                    <Bar dataKey="soni" fill="#43a047" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="chart-title">Сўнгги беморлар</h3>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Бемор</th>
                    <th>Ёш/Жинс</th>
                    <th>Телефон</th>
                    <th>Манзил</th>
                    <th>Ройхатдан отган сана</th>
                    <th>Амал</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(bemor => (
                    <tr key={bemor.id} style={{ cursor: 'pointer' }} onClick={() => handleBemorClick(bemor.id)}>
                      <td><strong>{bemor.ism}</strong></td>
                      <td>{calculateAge(bemor.tugilganSana)} / {bemor.jinsi}</td>
                      <td>{bemor.telefon}</td>
                      <td>{bemor.manzil}</td>
                      <td>{new Date(bemor.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={(e) => { e.stopPropagation(); handleBemorClick(bemor.id); }}
                        >
                          Кўриш
                        </button>
                      </td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan="6" className="empty-message">Беморлар топилмади</td>
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

export default Bemorlar;
