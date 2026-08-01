import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import '../styles/bolimlar.css';

const Bolimlar = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState(null);
    const filialId = localStorage.getItem('filialId');

    useEffect(() => {
        fetchDepartments();
    }, []);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const rootUrl = 'http://localhost:9000';
        const cleanPath = path.replace(/\\/g, '/');
        return `${rootUrl}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
    };

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/department?filialId=${filialId}`);
            setDepartments(res || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout title="Бўлимлар">
            <div className="bolimlar-container">
                <div className="page-header">
                    <h1>Клиника бўlimlari</h1>
                    <p className="page-subtitle">Филиалингиздаги барча бўлимлар ва уларнинг масъуллари</p>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner">Юкланмоқда...</div>
                    </div>
                ) : (
                    <>
                        <div className="departments-grid">
                            {departments.map(dept => (
                                <div
                                    key={dept.id}
                                    className={`dept-card ${selectedDept?.id === dept.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedDept(dept.id === selectedDept?.id ? null : dept)}
                                >
                                    <div className="dept-icon-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                                            <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                                            <path d="M12 11h.01M12 7h.01M12 15h.01M8 11h.01M8 7h.01M8 15h.01M16 11h.01M16 7h.01M16 15h.01" />
                                        </svg>
                                    </div>
                                    <div className="dept-info">
                                        <h3>{dept.name}</h3>
                                        <div className="dept-head">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            <span>{dept.head || 'Раҳбар белгиланмаган'}</span>
                                        </div>
                                        <div className="dept-stats">
                                            <span>Xodimlar: {dept.Users?.length || 0} ta</span>
                                        </div>
                                    </div>
                                    <div className="dept-footer">
                                        <span className="dept-tag">ID: {dept.id}</span>
                                        <span className="dept-branch">{dept.Branch?.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedDept && (
                            <div className="dept-details-section">
                                <div className="section-header">
                                    <h2>{selectedDept.name} - Ходимлар</h2>
                                    <button className="close-details" onClick={() => setSelectedDept(null)}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="employees-list">
                                    {selectedDept.Users && selectedDept.Users.length > 0 ? (
                                        <div className="employees-grid">
                                            {selectedDept.Users.map(user => (
                                                <div key={user.id} className="employee-mini-card">
                                                    <div className="emp-photo">
                                                        {user.photo && user.photo !== 'default_avatar.png' ? (
                                                            <img src={getImageUrl(user.photo)} alt={user.name} />
                                                        ) : (
                                                            <div className="emp-initials">{user.name.charAt(0)}</div>
                                                        )}
                                                    </div>
                                                    <div className="emp-info">
                                                        <h4>{user.name}</h4>
                                                        <p>{user.specialization || user.role}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-employees">Бу бўлимда ҳозирча ходимлар мавжуд эмас.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {departments.length === 0 && (
                            <div className="empty-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48" style={{ marginBottom: '16px', opacity: 0.5 }}>
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <p>Ҳозирча бўлимлар мавжуд эмас</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default Bolimlar;
