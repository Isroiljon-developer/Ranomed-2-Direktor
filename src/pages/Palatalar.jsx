import React, { useState, useEffect } from 'react';
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
  Tooltip
} from 'recharts';
import '../styles/pages.css';

const Palatalar = () => {
  const [wardsList, setWardsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTuri, setFilterTuri] = useState('');
  const [filterHolat, setFilterHolat] = useState('');
  const [selectedWard, setSelectedWard] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingWard, setEditingWard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Standard',
    capacity: 4,
    price_per_day: 0,
    image: ''
  });

  const filialId = localStorage.getItem('filialId');

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/ward?filialId=${filialId}`);
      setWardsList(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await api.post('/upload', uploadData);
      setFormData(prev => ({ ...prev, image: res.path }));
    } catch (err) {
      console.error('Upload error:', err);
      alert("Rasm yuklashda xatolik");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, filialId };
      if (editingWard) {
        await api.put(`/admin/ward/${editingWard.id}`, data);
      } else {
        await api.post('/admin/ward', data);
      }
      setShowForm(false);
      resetForm();
      fetchWards();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('O\'chirilsinmi?')) return;
    try {
      await api.delete(`/admin/ward/${id}`);
      fetchWards();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Standard',
      capacity: 4,
      price_per_day: 0,
      image: ''
    });
    setEditingWard(null);
  };

  const openEdit = (ward, e) => {
    e.stopPropagation();
    setEditingWard(ward);
    setFormData({
      name: ward.name,
      type: ward.type,
      capacity: ward.capacity,
      price_per_day: ward.price_per_day,
      image: ward.image || ''
    });
    setShowForm(true);
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const hostname = window.location.hostname || 'localhost';
    const rootUrl = `http://${hostname}:9000`;
    const cleanPath = path.toString().replace(/\\/g, '/');
    const formattedPath = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;
    return `${rootUrl}${formattedPath}`.replace(/([^:]\/)\/+/g, "$1");
  };

  const getStatus = (palata) => {
    const band = palata.Occupants?.length || 0;
    if (band === 0) return 'available';
    if (band >= palata.capacity) return 'occupied';
    return 'partial';
  };

  const getStatusText = (palata) => {
    const band = palata.Occupants?.length || 0;
    if (band === 0) return 'Бўш';
    if (band >= palata.capacity) return 'Тўлиқ банд';
    return 'Қисман банд';
  };

  const calculateDays = (date) => {
    const start = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredPalatalar = wardsList.filter(p => {
    if (filterTuri && p.type.toLowerCase() !== filterTuri.toLowerCase()) return false;
    if (filterHolat) {
      const band = p.Occupants?.length || 0;
      if (filterHolat === 'bosh' && band > 0) return false;
      if (filterHolat === 'band' && band < p.capacity) return false;
    }
    return true;
  });

  const totalPalatalar = wardsList.length;
  const boshPalatalar = wardsList.filter(p => (p.Occupants?.length || 0) === 0).length;
  const bandPalatalar = wardsList.filter(p => (p.Occupants?.length || 0) >= p.capacity).length;
  const qismanBand = wardsList.filter(p => (p.Occupants?.length || 0) > 0 && (p.Occupants?.length || 0) < p.capacity).length;

  const totalOrinlar = wardsList.reduce((a, b) => a + (b.capacity || 0), 0);
  const bandOrinlar = wardsList.reduce((a, b) => a + (b.Occupants?.length || 0), 0);
  const boshOrinlar = totalOrinlar - bandOrinlar;

  const holatData = [
    { nom: 'Бўш', qiymat: boshPalatalar, color: '#43a047' },
    { nom: 'Қисман', qiymat: qismanBand, color: '#f57c00' },
    { nom: 'Банд', qiymat: bandPalatalar, color: '#e53935' }
  ];

  const turiBoyichaData = [
    { turi: 'Standart', soni: wardsList.filter(p => p.type === 'Standard' || p.type === 'Standart').length },
    { turi: 'Lux', soni: wardsList.filter(p => p.type === 'Lux').length },
    { turi: 'VIP', soni: wardsList.filter(p => p.type === 'VIP').length }
  ];

  return (
    <MainLayout title="Палаталар">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Палаталар назорати</h1>
        <button
          className="btn-primary"
          style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          + Янги палата
        </button>
      </div>

      {loading ? (
        <div className="loading-container">Юкланмоқда...</div>
      ) : (
        <>
          <div className="finance-stats">
            <div className="finance-stat-card">
              <div className="finance-stat-label">Жами палаталар</div>
              <div className="finance-stat-value">{totalPalatalar}</div>
            </div>
            <div className="finance-stat-card profit">
              <div className="finance-stat-label">Бўш палаталар</div>
              <div className="finance-stat-value">{boshPalatalar}</div>
            </div>
            <div className="finance-stat-card" style={{ background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)', color: 'white' }}>
              <div className="finance-stat-label">Банд палаталар</div>
              <div className="finance-stat-value">{bandPalatalar}</div>
            </div>
            <div className="finance-stat-card total">
              <div className="finance-stat-label">Бандлик даражаси</div>
              <div className="finance-stat-value">
                {totalPalatalar > 0 ? ((bandOrinlar / totalOrinlar) * 100).toFixed(0) : 0}%
              </div>
            </div>
          </div>

          <div className="charts-grid" style={{ marginBottom: '24px' }}>
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Палаталар ҳолати</h3>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={holatData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="qiymat"
                      label={({ nom, percent }) => `${nom} ${(percent * 100).toFixed(0)}%`}
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
                <h3 className="chart-title">Турлари бўйича</h3>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={turiBoyichaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="turi" stroke="#6c757d" fontSize={11} />
                    <YAxis stroke="#6c757d" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e9ecef' }} />
                    <Bar dataKey="soni" name="Сони" fill="#2196f3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="filters-bar">
            <div className="filter-group">
              <span className="filter-label">Тури:</span>
              <select
                className="filter-select"
                value={filterTuri}
                onChange={(e) => setFilterTuri(e.target.value)}
              >
                <option value="">Барчаси</option>
                <option value="standard">Стандарт</option>
                <option value="lux">Люкс</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div className="filter-group">
              <span className="filter-label">Ҳолат:</span>
              <select
                className="filter-select"
                value={filterHolat}
                onChange={(e) => setFilterHolat(e.target.value)}
              >
                <option value="">Барчаси</option>
                <option value="bosh">Бўш</option>
                <option value="band">Банд</option>
              </select>
            </div>
          </div>

          <div className="ward-grid">
            {filteredPalatalar.map(palata => {
              const status = getStatus(palata);
              const occupantsCount = palata.Occupants?.length || 0;
              const imgUrl = getImageUrl(palata.image);
              return (
                <div
                  key={palata.id}
                  className={`ward-card ${status}`}
                  onClick={() => setSelectedWard(palata)}
                  style={{ cursor: 'pointer', overflow: 'hidden' }}
                >
                  <div className="ward-image-container" style={{ height: '140px', width: '100%', position: 'relative' }}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={palata.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                        <span style={{ margin: 'auto' }}>Rasmi mavjud emas</span>
                      </div>
                    )}
                    <div className={`ward-badge ${status}`} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      {getStatusText(palata)}
                    </div>
                    {/* Management Buttons */}
                    <div className="ward-management-overlay" style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                      <button
                        onClick={(e) => openEdit(palata, e)}
                        style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '4px', padding: '5px', cursor: 'pointer', display: 'flex' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(palata.id); }}
                        style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '4px', padding: '5px', cursor: 'pointer', display: 'flex' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f44336" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div className="ward-header">
                      <div className="ward-number">{palata.name}</div>
                    </div>
                    <div className="ward-type">{palata.type} палата</div>

                    <div className="ward-progress">
                      <div className="ward-progress-bar">
                        <div
                          className="ward-progress-fill"
                          style={{
                            width: `${(occupantsCount / palata.capacity) * 100}%`,
                            background: status === 'available' ? '#43a047' : status === 'occupied' ? '#e53935' : '#f57c00'
                          }}
                        ></div>
                      </div>
                      <div className="ward-progress-text">
                        <strong>{occupantsCount}</strong> / {palata.capacity} ўрин банд
                      </div>
                    </div>

                    <div className="ward-price">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      {new Intl.NumberFormat('uz-UZ').format(palata.price_per_day)} сўм/кун
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ward Create/Edit Modal */}
          {showForm && (
            <div className="modal-overlay" onClick={() => setShowForm(false)} style={{ zIndex: 1100 }}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', width: '100%' }}>
                <div className="modal-header">
                  <h3>{editingWard ? 'Палатани таҳрирлаш' : 'Янги палата қўшиш'}</h3>
                  <button className="close-btn" onClick={() => setShowForm(false)}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Расм</label>
                      <div className="image-upload-wrapper" style={{
                        width: '100%',
                        height: '180px',
                        border: '2px dashed rgba(33, 150, 243, 0.3)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        background: '#f8fbff',
                        transition: 'all 0.3s ease'
                      }}>
                        {formData.image ? (
                          <>
                            <img src={getImageUrl(formData.image)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                              position: 'absolute',
                              bottom: '0',
                              left: '0',
                              right: '0',
                              background: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              padding: '5px',
                              textAlign: 'center',
                              fontSize: '11px'
                            }}>Rasmni o'zgartirish uchun bosing</div>
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', color: '#2196f3' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '10px' }}>
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>Rasm tanlang</div>
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>PNG, JPG formatlar</div>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Палата номи/рақами</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                        placeholder="Масалан: 101"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Тури</label>
                        <select
                          value={formData.type}
                          onChange={e => setFormData({ ...formData, type: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                          <option value="Standard">Стандарт</option>
                          <option value="Lux">Люкс</option>
                          <option value="VIP">VIP</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Сиғими</label>
                        <input
                          type="number"
                          value={formData.capacity}
                          onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                          required
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Нархи (кунига)</label>
                      <input
                        type="number"
                        value={formData.price_per_day}
                        onChange={e => setFormData({ ...formData, price_per_day: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '15px 20px', borderTop: '1px solid #eee' }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} style={{ padding: '8px 20px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Бекор қилиш</button>
                    <button type="submit" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '4px', border: 'none', background: '#2196f3', color: '#fff', cursor: 'pointer' }}>Сақлаш</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Ward Details Modal */}
          {selectedWard && (
            <div className="modal-overlay" onClick={() => setSelectedWard(null)} style={{ zIndex: 1000 }}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '100%' }}>
                <div className="modal-header">
                  <h3>{selectedWard.name} палата маълумотлари</h3>
                  <button className="close-btn" onClick={() => setSelectedWard(null)}>&times;</button>
                </div>
                <div className="modal-body">
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <p><strong>Тури:</strong> {selectedWard.type}</p>
                      <p><strong>Сиғими:</strong> {selectedWard.capacity} кишилик</p>
                      <p><strong>Нархи:</strong> {new Intl.NumberFormat('uz-UZ').format(selectedWard.price_per_day)} сўм/кун</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden' }}>
                        {selectedWard.image ? (
                          <img src={getImageUrl(selectedWard.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Расм йўқ</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <h4>Ётган беморлар ({selectedWard.Occupants?.length || 0})</h4>
                  <div className="table-container" style={{ marginTop: '10px' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Бемор</th>
                          <th>Келган санаси</th>
                          <th>Кун</th>
                          <th>Шифокор</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedWard.Occupants?.map(occ => (
                          <tr key={occ.id}>
                            <td>
                              <strong>{occ.Patient?.ism}</strong><br />
                              <small>{occ.Patient?.telefon}</small>
                            </td>
                            <td>{new Date(occ.admissionDate).toLocaleDateString()}</td>
                            <td>{calculateDays(occ.admissionDate)}</td>
                            <td>{occ.User?.name || 'Берилмаган'}</td>
                          </tr>
                        ))}
                        {(!selectedWard.Occupants || selectedWard.Occupants.length === 0) && (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Хозирда беморлар йўқ</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default Palatalar;
