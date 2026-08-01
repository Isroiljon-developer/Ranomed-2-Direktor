import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import '../styles/pages.css';

const Shifokorlar = () => {
  const navigate = useNavigate();
  const [shifokorlarList, setShifokorlarList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const filialId = localStorage.getItem('filialId');

  const [newShifokor, setNewShifokor] = useState({
    ism: '',
    mutaxassislik: '',
    filialId: filialId,
    telefon: '',
    lavozim: 'Биринчи тоифали шифокор',
    email: '',
    password: '',
    rasm: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/user?role=doctor&filialId=${filialId}`);
      setShifokorlarList(res || []);
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
        setNewShifokor({ ...newShifokor, rasm: res.path });
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

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('') : '?';
  };

  const handleDoctorClick = (id) => {
    navigate(`/shifokorlar/${id}`);
  };

  const handleAddShifokor = async () => {
    if (!newShifokor.ism || !newShifokor.mutaxassislik || !newShifokor.email || !newShifokor.password) {
      alert('Илтимос, барча майдонларни тўлдиринг (исм, мутахассислик, email, парол)');
      return;
    }

    try {
      const shifokorData = {
        name: newShifokor.ism,
        username: newShifokor.email,
        password: newShifokor.password,
        role: 'doctor',
        filialId: parseInt(filialId),
        specialization: newShifokor.mutaxassislik,
        phone: newShifokor.telefon,
        photo: newShifokor.rasm
      };

      await api.post('/admin/user', shifokorData);
      setShowModal(false);
      fetchDoctors();

      setNewShifokor({
        ism: '',
        mutaxassislik: '',
        filialId: filialId,
        telefon: '',
        lavozim: 'Биринчи тоифали шифокор',
        email: '',
        password: '',
        rasm: ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteShifokor = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Шифокорни ўчиришни хоҳлайсизми?')) {
      try {
        await api.delete(`/admin/user/${id}`);
        setShifokorlarList(shifokorlarList.filter(s => s.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <MainLayout title="Шифокорлар">
      <div className="page-header">
        <h1>Шифокорлар самарадорлиги</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Янги шифокор
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <span className="filter-label">Мутахассислик:</span>
          <select className="filter-select">
            <option value="">Барчаси</option>
            <option value="terapevt">Терапевт</option>
            <option value="kardiolog">Кардиолог</option>
            <option value="nevrolog">Невролог</option>
            <option value="pediatr">Педиатр</option>
            <option value="hirurg">Хирург</option>
          </select>
        </div>
        <div className="filter-group" style={{ marginLeft: 'auto' }}>
          <input
            type="text"
            className="filter-input"
            placeholder="Қидириш..."
            style={{ width: '200px' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Юкланмоқда...</div>
      ) : (
        <div className="doctor-grid">
          {shifokorlarList.map((shifokor) => (
            <div
              key={shifokor.id}
              className="doctor-card"
              onClick={() => handleDoctorClick(shifokor.id)}
              style={{ cursor: 'pointer' }}
            >
              <button
                className="card-delete-btn"
                onClick={(e) => handleDeleteShifokor(shifokor.id, e)}
                title="Ўчириш"
              >
                ×
              </button>
              <div className="doctor-avatar">
                {shifokor.photo ? (
                  <img
                    src={getImageUrl(shifokor.photo)}
                    alt={shifokor.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  getInitials(shifokor.name)
                )}
              </div>
              <div className="doctor-name">{shifokor.name}</div>
              <div className="doctor-specialty">{shifokor.specialization || 'Шифокор'}</div>
              <div className="doctor-rating">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>4.5</span>
              </div>
              <div className="doctor-stats">
                <div className="doctor-stat">
                  <div className="doctor-stat-value">0</div>
                  <div className="doctor-stat-label">Беморлар</div>
                </div>
                <div className="doctor-stat">
                  <div className="doctor-stat-value" style={{ color: 'var(--primary-green)' }}>
                    0M
                  </div>
                  <div className="doctor-stat-label">Тушум</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Янги шифокор қўшиш</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Расм</label>
                <div className="image-upload-container">
                  {newShifokor.rasm ? (
                    <div className="image-preview">
                      <img src={getImageUrl(newShifokor.rasm)} alt="Preview" />
                      <button type="button" className="remove-image" onClick={() => setNewShifokor({ ...newShifokor, rasm: '' })}>×</button>
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
                  value={newShifokor.ism}
                  onChange={(e) => setNewShifokor({ ...newShifokor, ism: e.target.value })}
                  placeholder="Исм фамилия"
                />
              </div>
              <div className="form-group">
                <label>Email (тизимга кириш учун)</label>
                <input
                  type="email"
                  value={newShifokor.email}
                  onChange={(e) => setNewShifokor({ ...newShifokor, email: e.target.value })}
                  placeholder="shifokor@Ranomed -2 .uz"
                />
              </div>
              <div className="form-group">
                <label>Парол (тизимга кириш учун)</label>
                <input
                  type="password"
                  value={newShifokor.password}
                  onChange={(e) => setNewShifokor({ ...newShifokor, password: e.target.value })}
                  placeholder="Парол киритинг"
                />
              </div>
              <div className="form-group">
                <label>Мутахассислик</label>
                <select
                  value={newShifokor.mutaxassislik}
                  onChange={(e) => setNewShifokor({ ...newShifokor, mutaxassislik: e.target.value })}
                >
                  <option value="">Танланг</option>
                  <option value="Терапевт">Терапевт</option>
                  <option value="Кардиолог">Кардиолог</option>
                  <option value="Невролог">Невролог</option>
                  <option value="Педиатр">Педиатр</option>
                  <option value="Хирург">Хирург</option>
                  <option value="Гинеколог">Гинеколог</option>
                  <option value="Офталмолог">Офталмолог</option>
                  <option value="Дерматолог">Дерматолог</option>
                </select>
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="text"
                  value={newShifokor.telefon}
                  onChange={(e) => setNewShifokor({ ...newShifokor, telefon: e.target.value })}
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div className="form-group">
                <label>Лавозим</label>
                <select
                  value={newShifokor.lavozim}
                  onChange={(e) => setNewShifokor({ ...newShifokor, lavozim: e.target.value })}
                >
                  <option value="Олий тоифали шифокор">Олий тоифали шифокор</option>
                  <option value="Биринчи тоифали шифокор">Биринчи тоифали шифокор</option>
                  <option value="Иккинчи тоифали шифокор">Иккинчи тоифали шифокор</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Бекор қилиш</button>
              <button className="btn btn-primary" onClick={handleAddShifokor}>Қўшиш</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Shifokorlar;
