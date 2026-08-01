import React from 'react';
import MainLayout from '../layout/MainLayout';
import '../styles/pages.css';

const Sozlamalar = () => {
  return (
    <MainLayout title="Созламалар">
      <div className="page-header">
        <h1>Созламалар</h1>
      </div>

      {/* Umumiy sozlamalar */}
      <div className="settings-section">
        <div className="settings-header">
          <h3 className="settings-title">Умумий созламалар</h3>
        </div>
        <div className="settings-body">
          <div className="settings-row">
            <div className="settings-label">
              <span>Клиника номи</span>
              <small>Тизимда кўринадиган ном</small>
            </div>
            <input type="text" className="settings-input" defaultValue="Ranomed -2 " />
          </div>
          <div className="settings-row">
            <div className="settings-label">
              <span>Телефон рақам</span>
              <small>Асосий алоқа рақами</small>
            </div>
            <input type="text" className="settings-input" defaultValue="+998 71 123 45 67" />
          </div>
          <div className="settings-row">
            <div className="settings-label">
              <span>Электрон почта</span>
              <small>Расмий почта манзили</small>
            </div>
            <input type="email" className="settings-input" defaultValue="info@Ranomed -2 .uz" />
          </div>
          <div className="settings-row">
            <div className="settings-label">
              <span>Манзил</span>
              <small>Бош офис манзили</small>
            </div>
            <input type="text" className="settings-input" defaultValue="Тошкент ш., Мирзо Улуғбек тумани" />
          </div>
        </div>
      </div>

      {/* Hisobot sozlamalari */}
      <div className="settings-section">
        <div className="settings-header">
          <h3 className="settings-title">Ҳисобот созламалари</h3>
        </div>
        <div className="settings-body">
          <div className="settings-row">
            <div className="settings-label">
              <span>Ҳисобот формати</span>
              <small>Экспорт қилинадиган формат</small>
            </div>
            <select className="filter-select" style={{ width: '300px' }}>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div className="settings-row">
            <div className="settings-label">
              <span>Автоматик ҳисобот</span>
              <small>Ҳар ойда автоматик ҳисобот юбориш</small>
            </div>
            <select className="filter-select" style={{ width: '300px' }}>
              <option value="on">Ёқилган</option>
              <option value="off">Ўчирилган</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bildirishnoma */}
      <div className="settings-section">
        <div className="settings-header">
          <h3 className="settings-title">Билдиришнома созламалари</h3>
        </div>
        <div className="settings-body">
          <div className="settings-row">
            <div className="settings-label">
              <span>Электрон почта билдиришномалари</span>
              <small>Муҳим воқеалар ҳақида хабар</small>
            </div>
            <select className="filter-select" style={{ width: '300px' }}>
              <option value="on">Ёқилган</option>
              <option value="off">Ўчирилган</option>
            </select>
          </div>
          <div className="settings-row">
            <div className="settings-label">
              <span>Телеграм билдиришномалар</span>
              <small>Телеграм орқали хабар олиш</small>
            </div>
            <select className="filter-select" style={{ width: '300px' }}>
              <option value="on">Ёқилган</option>
              <option value="off">Ўчирилган</option>
            </select>
          </div>
          <div className="settings-row">
            <div className="settings-label">
              <span>Шикоятлар хабарномаси</span>
              <small>Янги шикоят келганда хабар</small>
            </div>
            <select className="filter-select" style={{ width: '300px' }}>
              <option value="on">Ёқилган</option>
              <option value="off">Ўчирилган</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="settings-section">
        <div className="settings-header">
          <h3 className="settings-title">Маълумотларни экспорт қилиш</h3>
        </div>
        <div className="settings-body">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Молия ҳисоботи (PDF)
            </button>
            <button className="btn btn-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Беморлар рўйхати (Excel)
            </button>
            <button className="btn btn-outline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Барча маълумотлар
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button className="btn btn-primary" style={{ padding: '12px 32px' }}>
          Сақлаш
        </button>
      </div>
    </MainLayout>
  );
};

export default Sozlamalar;
