import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { filiallar, shifokorlar, bemorlar, palatalar, moliyaStatistika } from '../data/mockData';
import '../styles/pages.css';

const Filiallar = () => {
  const navigate = useNavigate();
  const getFilialStats = (filialId) => {
    const shifokorSoni = shifokorlar.filter(s => s.filialId === filialId).length;
    const bemorSoni = bemorlar.filter(b => b.filialId === filialId).length;
    const palata = palatalar.filter(p => p.filialId === filialId);
    const bandPalata = palata.filter(p => p.band > 0).length;
    const moliya = moliyaStatistika.filialBoyicha.find(m => m.filialId === filialId);
    
    return {
      shifokorSoni,
      bemorSoni,
      bandPalata,
      jamiPalata: palata.length,
      tushum: moliya ? moliya.tushum : 0
    };
  };

  return (
    <MainLayout title="Филиаллар">
      <div className="page-header">
        <h1>Филиаллар назорати</h1>
        <div className="page-actions">
          <button className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Янги филиал
          </button>
        </div>
      </div>

      <div className="branch-grid">
        {filiallar.map((filial) => {
          const stats = getFilialStats(filial.id);
          return (
            <div key={filial.id} className="branch-card">
              <img 
                src={filial.rasm} 
                alt={filial.nom} 
                className="branch-card-image"
              />
              <div className="branch-card-header with-image">
                <div className="branch-name">{filial.nom}</div>
                <div className="branch-address">{filial.manzil}</div>
              </div>
              <div className="branch-stats">
                <div className="branch-stat">
                  <div className="branch-stat-value">{stats.bemorSoni}</div>
                  <div className="branch-stat-label">Беморлар</div>
                </div>
                <div className="branch-stat">
                  <div className="branch-stat-value">{stats.shifokorSoni}</div>
                  <div className="branch-stat-label">Шифокорлар</div>
                </div>
                <div className="branch-stat">
                  <div className="branch-stat-value">{stats.bandPalata}/{stats.jamiPalata}</div>
                  <div className="branch-stat-label">Палаталар</div>
                </div>
              </div>
              <div className="branch-footer">
                <div>
                  <span style={{ color: 'var(--gray-600)', fontSize: '13px' }}>Бугунги тушум:</span>
                  <div style={{ fontWeight: '700', color: 'var(--primary-green)', fontSize: '18px' }}>
                    {(stats.tushum / 1000000).toFixed(1)}M сўм
                  </div>
                </div>
                <button className="btn btn-outline" onClick={() => navigate(`/filiallar/${filial.id}`)}>Батафсил</button>
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Filiallar;
