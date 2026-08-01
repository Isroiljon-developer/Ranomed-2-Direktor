import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { filiallar, shifokorlar, xodimlar, palatalar, bemorlar, navbatlar } from '../data/mockData';
import '../styles/pages.css';
import '../styles/filial-detail.css';

const FilialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('umumiy');

  const filial = filiallar.find(f => f.id === parseInt(id));
  
  if (!filial) {
    return (
      <MainLayout title="Филиал топилмади">
        <div className="not-found">
          <h2>Филиал топилмади</h2>
          <button className="btn btn-primary" onClick={() => navigate('/filiallar')}>
            Филиалларга қайтиш
          </button>
        </div>
      </MainLayout>
    );
  }

  const filialShifokorlar = shifokorlar.filter(s => s.filialId === filial.id);
  const filialXodimlar = xodimlar.filter(x => x.filialId === filial.id);
  const filialPalatalar = palatalar.filter(p => p.filialId === filial.id);
  const filialBemorlar = bemorlar.filter(b => b.filialId === filial.id);
  const filialNavbatlar = navbatlar.filter(n => n.filialId === filial.id);

  const bandPalatalar = filialPalatalar.filter(p => p.band > 0).length;
  const boshPalatalar = filialPalatalar.filter(p => p.band === 0).length;

  const tabs = [
    { id: 'umumiy', label: 'Умумий', icon: '📊' },
    { id: 'shifokorlar', label: 'Шифокорлар', icon: '👨‍⚕️' },
    { id: 'xodimlar', label: 'Ходимлар', icon: '👥' },
    { id: 'palatalar', label: 'Палаталар', icon: '🛏️' },
    { id: 'bemorlar', label: 'Беморлар', icon: '🏥' },
    { id: 'navbatlar', label: 'Навбатлар', icon: '📋' }
  ];

  return (
    <MainLayout title={filial.nom}>
      <div className="filial-detail">
        <div className="filial-detail-header">
          <button className="btn btn-outline back-btn" onClick={() => navigate('/filiallar')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Орқага
          </button>
          <div className="filial-detail-info">
            <h1>{filial.nom}</h1>
            <p>{filial.manzil}</p>
          </div>
        </div>

        <div className="filial-stats-row">
          <div className="filial-stat-card">
            <div className="stat-icon blue">👨‍⚕️</div>
            <div className="stat-content">
              <div className="stat-value">{filialShifokorlar.length}</div>
              <div className="stat-label">Шифокорлар</div>
            </div>
          </div>
          <div className="filial-stat-card">
            <div className="stat-icon green">👥</div>
            <div className="stat-content">
              <div className="stat-value">{filialXodimlar.length}</div>
              <div className="stat-label">Ходимлар</div>
            </div>
          </div>
          <div className="filial-stat-card">
            <div className="stat-icon orange">🛏️</div>
            <div className="stat-content">
              <div className="stat-value">{bandPalatalar}/{filialPalatalar.length}</div>
              <div className="stat-label">Банд палаталар</div>
            </div>
          </div>
          <div className="filial-stat-card">
            <div className="stat-icon purple">🏥</div>
            <div className="stat-content">
              <div className="stat-value">{filialBemorlar.length}</div>
              <div className="stat-label">Беморлар</div>
            </div>
          </div>
          <div className="filial-stat-card">
            <div className="stat-icon red">📋</div>
            <div className="stat-content">
              <div className="stat-value">{filialNavbatlar.length}</div>
              <div className="stat-label">Навбатлар</div>
            </div>
          </div>
        </div>

        <div className="filial-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'umumiy' && (
            <div className="umumiy-content">
              <div className="info-grid">
                <div className="info-card">
                  <h3>Филиал маълумотлари</h3>
                  <div className="info-row">
                    <span className="info-label">Номи:</span>
                    <span className="info-value">{filial.nom}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Манзил:</span>
                    <span className="info-value">{filial.manzil}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Телефон:</span>
                    <span className="info-value">{filial.telefon}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Директор:</span>
                    <span className="info-value">{filial.direktor}</span>
                  </div>
                </div>
                <div className="info-card">
                  <h3>Бугунги статистика</h3>
                  <div className="info-row">
                    <span className="info-label">Қабул қилинган:</span>
                    <span className="info-value success">{filialBemorlar.length} та</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Навбатда:</span>
                    <span className="info-value warning">{filialNavbatlar.filter(n => n.status === 'kutmoqda').length} та</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Бўш палаталар:</span>
                    <span className="info-value">{boshPalatalar} та</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shifokorlar' && (
            <div className="shifokorlar-content">
              <div className="section-header">
                <h3>Филиал шифокорлари ({filialShifokorlar.length})</h3>
              </div>
              <div className="doctors-grid">
                {filialShifokorlar.map(doctor => (
                  <div key={doctor.id} className="doctor-card-mini">
                    <div className="doctor-avatar">
                      {doctor.ism.charAt(0)}
                    </div>
                    <div className="doctor-info">
                      <div className="doctor-name">{doctor.ism}</div>
                      <div className="doctor-specialty">{doctor.mutaxassislik}</div>
                      <div className="doctor-stats">
                        <span className="stat">⭐ {doctor.reyting}</span>
                        <span className="stat">👥 {doctor.bemorlarSoni}</span>
                      </div>
                    </div>
                    <div className={`doctor-status ${doctor.status}`}>
                      {doctor.status === 'faol' ? 'Фаол' : 'Банд'}
                    </div>
                  </div>
                ))}
                {filialShifokorlar.length === 0 && (
                  <div className="empty-state">Шифокорлар топилмади</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'xodimlar' && (
            <div className="xodimlar-content">
              <div className="section-header">
                <h3>Филиал ходимлари ({filialXodimlar.length})</h3>
              </div>
              <div className="staff-table">
                <table>
                  <thead>
                    <tr>
                      <th>Исми</th>
                      <th>Лавозими</th>
                      <th>Телефон</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filialXodimlar.map(xodim => (
                      <tr key={xodim.id}>
                        <td>{xodim.ism}</td>
                        <td>{xodim.lavozim}</td>
                        <td>{xodim.telefon}</td>
                        <td>
                          <span className={`badge ${xodim.status === 'ishda' ? 'success' : 'warning'}`}>
                            {xodim.status === 'ishda' ? 'Ишда' : 'Дам олишда'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filialXodimlar.length === 0 && (
                  <div className="empty-state">Ходимлар топилмади</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'palatalar' && (
            <div className="palatalar-content">
              <div className="section-header">
                <h3>Филиал палаталари ({filialPalatalar.length})</h3>
                <div className="palata-legend">
                  <span className="legend-item"><span className="dot green"></span> Бўш</span>
                  <span className="legend-item"><span className="dot orange"></span> Қисман банд</span>
                  <span className="legend-item"><span className="dot red"></span> Тўлиқ банд</span>
                </div>
              </div>
              <div className="wards-grid">
                {filialPalatalar.map(palata => {
                  const bandFoiz = (palata.band / palata.sigim) * 100;
                  let statusClass = 'empty';
                  if (bandFoiz === 100) statusClass = 'full';
                  else if (bandFoiz > 0) statusClass = 'partial';

                  return (
                    <div key={palata.id} className={`ward-card-mini ${statusClass}`}>
                      <div className="ward-number">{palata.raqam}</div>
                      <div className="ward-type">{palata.turi}</div>
                      <div className="ward-capacity">
                        <span className="current">{palata.band}</span>
                        <span className="separator">/</span>
                        <span className="total">{palata.sigim}</span>
                      </div>
                      <div className="ward-price">{palata.narx.toLocaleString()} сўм</div>
                    </div>
                  );
                })}
                {filialPalatalar.length === 0 && (
                  <div className="empty-state">Палаталар топилмади</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bemorlar' && (
            <div className="bemorlar-content">
              <div className="section-header">
                <h3>Филиал беморлари ({filialBemorlar.length})</h3>
              </div>
              <div className="patients-table">
                <table>
                  <thead>
                    <tr>
                      <th>Исми</th>
                      <th>Ёши</th>
                      <th>Телефон</th>
                      <th>Ташхис</th>
                      <th>Сана</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filialBemorlar.map(bemor => (
                      <tr key={bemor.id}>
                        <td>{bemor.ism}</td>
                        <td>{bemor.yosh} ёш</td>
                        <td>{bemor.telefon}</td>
                        <td>{bemor.tashxis}</td>
                        <td>{bemor.sana}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filialBemorlar.length === 0 && (
                  <div className="empty-state">Беморлар топилмади</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'navbatlar' && (
            <div className="navbatlar-content">
              <div className="section-header">
                <h3>Филиал навбатлари ({filialNavbatlar.length})</h3>
              </div>
              <div className="queue-list">
                {filialNavbatlar.map(navbat => (
                  <div key={navbat.id} className={`queue-item ${navbat.status}`}>
                    <div className="queue-number">#{navbat.navbatRaqami}</div>
                    <div className="queue-info">
                      <div className="queue-patient">{navbat.bemorIsmi}</div>
                      <div className="queue-doctor">{navbat.shifokor} • {navbat.xizmat}</div>
                    </div>
                    <div className="queue-time">{navbat.vaqt}</div>
                    <div className={`queue-status ${navbat.status}`}>
                      {navbat.status === 'kutmoqda' ? 'Кутмоқда' : 
                       navbat.status === 'qabulda' ? 'Қабулда' : 'Тугаган'}
                    </div>
                  </div>
                ))}
                {filialNavbatlar.length === 0 && (
                  <div className="empty-state">Навбатлар топилмади</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FilialDetail;
