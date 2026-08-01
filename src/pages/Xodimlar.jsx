import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import '../styles/pages.css';

const Xodimlar = () => {
  const navigate = useNavigate();
  const [xodimlarList, setXodimlarList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const filialId = localStorage.getItem('filialId');

  const [newXodim, setNewXodim] = useState({
    ism: '',
    lavozim: '',
    filialId: filialId,
    ishVaqti: '08:00',
    email: '',
    password: '',
    rasm: ''
  });

  useEffect(() => {
    fetchXodimlar();
  }, []);

  const fetchXodimlar = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/user?filialId=${filialId}`);
      // Filter out admin, director, and doctors to show only staff
      const filtered = res.filter(u => !['admin', 'director', 'doctor'].includes(u.role));
      setXodimlarList(filtered || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await api.post('/upload', formData);
        setNewXodim({ ...newXodim, rasm: res.path });
      } catch (err) {
        alert("Расм юклашда хатолик");
      }
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const rootUrl = 'http://localhost:9000';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${rootUrl}${cleanPath}`;
  };

  const handleXodimClick = (id) => {
    navigate(`/xodimlar/${id}`);
  };

  const roleToUz = (role) => {
    const roles = {
      'nurse': 'Ҳамшира',
      'hamshira': 'Ҳамшира',
      'reception': 'Қабулхона',
      'cashier': 'Кассир',
      'lab': 'Лаборант',
      'warehouse': 'Омборчи'
    };
    return roles[role] || role;
  };

  const handleAddXodim = async () => {
    if (!newXodim.ism || !newXodim.lavozim || !newXodim.email || !newXodim.password) {
      alert('Илтимос, барча майдонларни тўлдиринг (исм, лавозим, email, парол)');
      return;
    }

    try {
      const xodimData = {
        name: newXodim.ism,
        username: newXodim.email,
        password: newXodim.password,
        role: newXodim.lavozim,
        filialId: parseInt(filialId),
        phone: '',
        photo: newXodim.rasm,
      };

      await api.post('/admin/user', xodimData);
      setShowModal(false);
      fetchXodimlar();

      setNewXodim({
        ism: '',
        lavozim: '',
        filialId: filialId,
        ishVaqti: '08:00',
        email: '',
        password: '',
        rasm: ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteXodim = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Ходимни ўчиришни хоҳлайсизми?')) {
      try {
        await api.delete(`/admin/user/${id}`);
        setXodimlarList(xodimlarList.filter(x => x.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <MainLayout title="Ходимлар">
      <div className="page-header">
        <h1>Ходимлар назорати</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Янги ходим
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Юкланмоқда...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Ходим</th>
                  <th>Лавозим</th>
                  <th>Иш вақти</th>
                  <th>Ҳолат</th>
                  <th>Амаллар</th>
                </tr>
              </thead>
              <tbody>
                {xodimlarList.map(xodim => (
                  <tr key={xodim.id} onClick={() => handleXodimClick(xodim.id)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {xodim.photo ? (
                          <img
                            src={getImageUrl(xodim.photo)}
                            alt={xodim.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}>
                            {xodim.name ? xodim.name.split(' ').map(n => n[0]).join('') : '?'}
                          </div>
                        )}
                        <strong>{xodim.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{roleToUz(xodim.role)}</span>
                    </td>
                    <td>08:00 - 17:00</td>
                    <td>
                      <span className={`badge ${xodim.is_active ? 'badge-success' : 'badge-warning'}`}>
                        {xodim.is_active ? 'Ишда' : 'Фаол эмас'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={(e) => { e.stopPropagation(); handleXodimClick(xodim.id); }}
                        >
                          Кўриш
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => handleDeleteXodim(xodim.id, e)}
                        >
                          Ўчириш
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Янги ходим қўшиш</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Расм</label>
                <div className="image-upload-container">
                  {newXodim.rasm ? (
                    <div className="image-preview">
                      <img src={getImageUrl(newXodim.rasm)} alt="Preview" />
                      <button type="button" className="remove-image" onClick={() => setNewXodim({ ...newXodim, rasm: '' })}>×</button>
                    </div>
                  ) : (
                    <label className="image-upload-label">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>Расм юклаш</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Исм фамилия</label>
                <input
                  type="text"
                  value={newXodim.ism}
                  onChange={(e) => setNewXodim({ ...newXodim, ism: e.target.value })}
                  placeholder="Исм фамилия"
                />
              </div>
              <div className="form-group">
                <label>Email (тизимга кириш учун)</label>
                <input
                  type="email"
                  value={newXodim.email}
                  onChange={(e) => setNewXodim({ ...newXodim, email: e.target.value })}
                  placeholder="xodim@Ranomed -2 .uz"
                />
              </div>
              <div className="form-group">
                <label>Парол (тизимга кириш учун)</label>
                <input
                  type="password"
                  value={newXodim.password}
                  onChange={(e) => setNewXodim({ ...newXodim, password: e.target.value })}
                  placeholder="Парол киритинг"
                />
              </div>
              <div className="form-group">
                <label>Лавозим</label>
                <select
                  value={newXodim.lavozim}
                  onChange={(e) => setNewXodim({ ...newXodim, lavozim: e.target.value })}
                >
                  <option value="">Танланг</option>
                  <option value="nurse">Ҳамшира</option>
                  <option value="reception">Қабулхона</option>
                  <option value="cashier">Кассир</option>
                  <option value="lab">Лаборант</option>
                </select>
              </div>
              <div className="form-group">
                <label>Иш вақти</label>
                <input
                  type="time"
                  value={newXodim.ishVaqti}
                  onChange={(e) => setNewXodim({ ...newXodim, ishVaqti: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Бекор қилиш</button>
              <button className="btn btn-primary" onClick={handleAddXodim}>Қўшиш</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Xodimlar;
