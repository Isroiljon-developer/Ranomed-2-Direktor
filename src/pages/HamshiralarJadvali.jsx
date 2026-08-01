import React, { useState, useEffect } from 'react';
import api from '../api';

const MONTHS = [
  'Yanvar','Fevral','Mart','Aprel','May','Iyun',
  'Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'
];
const DAYS_UZ = ['Du','Se','Ch','Pa','Ju','Sh','Ya'];
const SHIFT_OPTIONS = [
  { value: 'kunduzgi', label: '☀️ Kunduzgi (08:00-16:00)' },
  { value: 'kechki', label: '🌆 Kechki (16:00-24:00)' },
  { value: 'tungi', label: '🌙 Tungi (00:00-08:00)' },
  { value: 'dam_olish', label: '🏖️ Dam olish' },
];

const SHIFT_COLORS = {
  kunduzgi: { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
  kechki:   { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  tungi:    { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
  dam_olish:{ bg: '#dcfce7', text: '#166534', border: '#86efac' },
};

const SHIFT_LABELS = {
  kunduzgi: '☀️ Kunduzgi',
  kechki: '🌆 Kechki',
  tungi: '🌙 Tungi',
  dam_olish: '🏖️ Dam',
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday=0
}

export default function HamshiralarJadvali() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [nurses, setNurses]     = useState([]);
  const [schedules, setSchedules] = useState({}); // { nurseId: { day: shift } }
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editNurse, setEditNurse] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); // { nurseId, day }
  const [shiftPicker, setShiftPicker] = useState(null);

  const [form, setForm] = useState({
    name: '', department: '', branch: '', phone: ''
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => { fetchNurses(); }, []);
  useEffect(() => { if (nurses.length) fetchSchedules(); }, [nurses, year, month]);

  const fetchNurses = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/user?role=nurse');
      const arr = Array.isArray(data) ? data : (data?.data || []);
      // Also get hamshira role
      const data2 = await api.get('/admin/user?role=hamshira').catch(() => []);
      const arr2 = Array.isArray(data2) ? data2 : (data2?.data || []);
      const merged = [...arr, ...arr2].filter((v,i,a) => a.findIndex(x=>x.id===v.id)===i);
      setNurses(merged.length ? merged : getDefaultNurses());
    } catch (e) {
      setNurses(getDefaultNurses());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultNurses = () => [
    { id: 1, name: 'Malika Karimova', department: 'Kardiologiya', Branch: { name: 'Asosiy filial' } },
    { id: 2, name: 'Shahnoza Aliyeva', department: 'Nevrologiya', Branch: { name: 'Chilonzor' } },
    { id: 3, name: 'Nargiza Umarova', department: 'Pediatriya', Branch: { name: 'Asosiy filial' } },
    { id: 4, name: 'Dilnoza Rahmatova', department: 'Xirurgiya', Branch: { name: 'Yunusobod' } },
  ];

  const fetchSchedules = async () => {
    // Load from localStorage for now (since backend model may not exist)
    const key = `schedule_${year}_${month}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { setSchedules(JSON.parse(saved)); } catch {}
    }
  };

  const saveSchedules = (newSchedules) => {
    const key = `schedule_${year}_${month}`;
    localStorage.setItem(key, JSON.stringify(newSchedules));
    setSchedules(newSchedules);
  };

  const handleCellClick = (nurseId, day) => {
    setShiftPicker({ nurseId, day });
  };

  const applyShift = (shift) => {
    if (!shiftPicker) return;
    const { nurseId, day } = shiftPicker;
    const updated = {
      ...schedules,
      [nurseId]: {
        ...(schedules[nurseId] || {}),
        [day]: shift
      }
    };
    saveSchedules(updated);
    setShiftPicker(null);
    showToast('Navbat saqlandi');
  };

  const clearShift = () => {
    if (!shiftPicker) return;
    const { nurseId, day } = shiftPicker;
    const nurseSchedule = { ...(schedules[nurseId] || {}) };
    delete nurseSchedule[day];
    const updated = { ...schedules, [nurseId]: nurseSchedule };
    saveSchedules(updated);
    setShiftPicker(null);
    showToast('Navbat o\'chirildi');
  };

  const handleAddNurse = () => {
    setForm({ name: '', department: '', branch: '', phone: '' });
    setEditNurse(null);
    setShowAddModal(true);
  };

  const handleEditNurse = (nurse) => {
    setForm({
      name: nurse.name || '',
      department: nurse.department || nurse.specialization || '',
      branch: nurse.Branch?.name || '',
      phone: nurse.phone || ''
    });
    setEditNurse(nurse);
    setShowAddModal(true);
  };

  const handleSaveNurse = async () => {
    if (!form.name.trim()) { showToast('Ism kiritish shart!', 'error'); return; }
    setSaving(true);
    try {
      if (editNurse && editNurse.id > 100) {
        // Demo nurse - just update locally
        setNurses(prev => prev.map(n => n.id === editNurse.id ? {
          ...n, name: form.name, department: form.department,
          Branch: { name: form.branch }, phone: form.phone
        } : n));
      } else if (editNurse) {
        await api.put(`/admin/user/${editNurse.id}`, {
          name: form.name, specialization: form.department, phone: form.phone
        });
        setNurses(prev => prev.map(n => n.id === editNurse.id ? {
          ...n, name: form.name, department: form.department,
          specialization: form.department, phone: form.phone
        } : n));
      } else {
        // Add new local nurse (demo)
        const newId = Date.now();
        setNurses(prev => [...prev, {
          id: newId, name: form.name,
          department: form.department,
          phone: form.phone,
          Branch: { name: form.branch || 'Asosiy filial' }
        }]);
      }
      showToast(editNurse ? 'Hamshira yangilandi' : 'Hamshira qo\'shildi');
      setShowAddModal(false);
    } catch(e) {
      showToast('Xatolik: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNurse = (nurse) => {
    setDeleteConfirm(nurse);
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setNurses(prev => prev.filter(n => n.id !== deleteConfirm.id));
    const updated = { ...schedules };
    delete updated[deleteConfirm.id];
    saveSchedules(updated);
    showToast('Hamshira o\'chirildi');
    setDeleteConfirm(null);
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Stats per nurse
  const getNurseStats = (nurseId) => {
    const s = schedules[nurseId] || {};
    const counts = { kunduzgi: 0, kechki: 0, tungi: 0, dam_olish: 0 };
    Object.values(s).forEach(v => { if (counts[v] !== undefined) counts[v]++; });
    return counts;
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = days.map(d => {
    const date = new Date(year, month, d);
    return DAYS_UZ[date.getDay() === 0 ? 6 : date.getDay() - 1];
  });
  const isWeekend = days.map(d => {
    const date = new Date(year, month, d);
    return date.getDay() === 0 || date.getDay() === 6;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .sch-cell { cursor: pointer; min-width: 42px; height: 38px; border-radius: 8px; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; transition: all 0.15s; position: relative; }
        .sch-cell:hover { transform: scale(1.08); box-shadow: 0 2px 8px rgba(0,0,0,0.12); z-index: 2; }
        .sch-cell.empty { background: #f8fafc; color: #cbd5e1; }
        .sch-cell.weekend { background: #fafafa; }
        .modal-bg { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-box { background: white; border-radius: 20px; padding: 28px; min-width: 360px; box-shadow: 0 30px 60px rgba(0,0,0,0.2); animation: slideUp 0.2s ease; }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; transition: border-color 0.2s; box-sizing: border-box; }
        .input-field:focus { border-color: #6366f1; background: white; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 14px; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.35); }
        .btn-outline { border: 1.5px solid #e2e8f0; background: white; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 14px; transition: all 0.2s; }
        .btn-outline:hover { background: #f8fafc; }
        .btn-danger { background: #fee2e2; color: #b91c1c; border: none; padding: 7px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; transition: all 0.2s; }
        .btn-danger:hover { background: #fecaca; }
        .btn-edit { background: #eff6ff; color: #1d4ed8; border: none; padding: 7px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 12px; transition: all 0.2s; }
        .btn-edit:hover { background: #dbeafe; }
        .toast { position: fixed; bottom: 24px; right: 24px; padding: 14px 22px; border-radius: 12px; font-weight: 600; font-size: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 9999; animation: slideUp 0.2s ease; }
        .toast.success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
        .toast.error { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
        .shift-picker { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .shift-picker-box { background: white; border-radius: 16px; padding: 22px; min-width: 280px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
        .shift-option { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 10px; cursor: pointer; transition: all 0.15s; margin-bottom: 8px; border: 1.5px solid transparent; }
        .shift-option:hover { border-color: #6366f1; background: #f5f3ff; }
      `}</style>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'white', margin: 0 }}>🏥 Hamshiralar Jadvali</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
            {MONTHS[month]} {year} — {daysInMonth} kun
          </p>
        </div>
        <button className="btn-primary" onClick={handleAddNurse} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          + Hamshira qo'shish
        </button>
      </div>

      {/* Month Navigator */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-outline" onClick={prevMonth} style={{ padding: '8px 16px' }}>◀ Oldingi</button>
        <span style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a', minWidth: '160px', textAlign: 'center' }}>
          {MONTHS[month]} {year}
        </span>
        <button className="btn-outline" onClick={nextMonth} style={{ padding: '8px 16px' }}>Keyingi ▶</button>
        <button className="btn-outline" onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }} style={{ padding: '8px 16px', marginLeft: 'auto' }}>
          Bugun
        </button>
      </div>

      {/* Legend */}
      <div style={{ padding: '12px 32px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Ranglar:</span>
        {Object.entries(SHIFT_COLORS).map(([key, c]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: c.bg, border: `1.5px solid ${c.border}` }} />
            <span style={{ fontSize: '12px', color: '#475569' }}>{SHIFT_LABELS[key]}</span>
          </div>
        ))}
        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>💡 Katakka bosib navbat belgilang</span>
      </div>

      {/* Schedule Table */}
      <div style={{ padding: '24px 32px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '16px' }}>
            ⏳ Yuklanmoqda...
          </div>
        ) : nurses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
            Hamshiralar ro'yxati bo'sh
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', width: '200px', borderBottom: '1px solid #e2e8f0', position: 'sticky', left: 0, background: '#f8fafc', zIndex: 1 }}>
                    Hamshira
                  </th>
                  {days.map((d, idx) => (
                    <th key={d} style={{
                      padding: '8px 4px', textAlign: 'center', fontSize: '11px', fontWeight: 700,
                      color: isWeekend[idx] ? '#ef4444' : '#64748b',
                      borderBottom: '1px solid #e2e8f0', minWidth: '42px',
                      background: isWeekend[idx] ? '#fff5f5' : '#f8fafc'
                    }}>
                      <div>{d}</div>
                      <div style={{ fontSize: '9px', fontWeight: 500, color: isWeekend[idx] ? '#ef4444' : '#94a3b8' }}>{dayNames[idx]}</div>
                    </th>
                  ))}
                  <th style={{ padding: '14px 12px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', minWidth: '120px' }}>
                    Statistika
                  </th>
                  <th style={{ padding: '14px 12px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', minWidth: '100px' }}>
                    Amal
                  </th>
                </tr>
              </thead>
              <tbody>
                {nurses.map((nurse, ni) => {
                  const stats = getNurseStats(nurse.id);
                  return (
                    <tr key={nurse.id} style={{ background: ni % 2 === 0 ? 'white' : '#fafbfd', borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', position: 'sticky', left: 0, background: ni % 2 === 0 ? 'white' : '#fafbfd', zIndex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{nurse.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          {nurse.department || nurse.specialization || '—'} • {nurse.Branch?.name || '—'}
                        </div>
                      </td>
                      {days.map((d, idx) => {
                        const shift = schedules[nurse.id]?.[d];
                        const colors = shift ? SHIFT_COLORS[shift] : null;
                        return (
                          <td key={d} style={{ padding: '4px 2px', textAlign: 'center' }}>
                            <div
                              className={`sch-cell ${!shift ? 'empty' : ''} ${isWeekend[idx] ? 'weekend' : ''}`}
                              style={colors ? { background: colors.bg, color: colors.text, borderColor: colors.border } : {}}
                              onClick={() => handleCellClick(nurse.id, d)}
                              title={shift ? SHIFT_LABELS[shift] : 'Navbat belgilash'}
                            >
                              {shift ? SHIFT_LABELS[shift]?.split(' ')[0] : (isWeekend[idx] ? '—' : '+')}
                            </div>
                          </td>
                        );
                      })}
                      <td style={{ padding: '8px 12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px' }}>
                          {stats.kunduzgi > 0 && <span style={{ color: SHIFT_COLORS.kunduzgi.text }}>☀️ {stats.kunduzgi} kun</span>}
                          {stats.kechki > 0  && <span style={{ color: SHIFT_COLORS.kechki.text  }}>🌆 {stats.kechki} kun</span>}
                          {stats.tungi > 0   && <span style={{ color: SHIFT_COLORS.tungi.text   }}>🌙 {stats.tungi} kun</span>}
                          {stats.dam_olish > 0 && <span style={{ color: SHIFT_COLORS.dam_olish.text }}>🏖️ {stats.dam_olish} kun</span>}
                          {Object.values(stats).every(v => v === 0) && <span style={{ color: '#94a3b8' }}>—</span>}
                        </div>
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button className="btn-edit" onClick={() => handleEditNurse(nurse)}>✏️</button>
                          <button className="btn-danger" onClick={() => handleDeleteNurse(nurse)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Shift Picker Modal */}
      {shiftPicker && (
        <div className="shift-picker" onClick={() => setShiftPicker(null)}>
          <div className="shift-picker-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>
              📅 {year}-{String(month+1).padStart(2,'0')}-{String(shiftPicker.day).padStart(2,'0')} — Navbat tanlang
            </h3>
            {SHIFT_OPTIONS.map(opt => (
              <div
                key={opt.value}
                className="shift-option"
                style={schedules[shiftPicker.nurseId]?.[shiftPicker.day] === opt.value ? {
                  borderColor: SHIFT_COLORS[opt.value].border,
                  background: SHIFT_COLORS[opt.value].bg
                } : {}}
                onClick={() => applyShift(opt.value)}
              >
                <span style={{ fontSize: '22px' }}>{opt.label.split(' ')[0]}</span>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{opt.label.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
            <button className="btn-danger" onClick={clearShift} style={{ width: '100%', marginTop: '8px', padding: '10px' }}>
              🗑️ Navbatni o'chirish
            </button>
            <button className="btn-outline" onClick={() => setShiftPicker(null)} style={{ width: '100%', marginTop: '8px', padding: '10px' }}>
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Nurse Modal */}
      {showAddModal && (
        <div className="modal-bg" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#0f172a' }}>
              {editNurse ? '✏️ Hamshirani tahrirlash' : '➕ Yangi Hamshira'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>F.I.O *</label>
                <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ism familiya" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Bo'lim</label>
                <input className="input-field" value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="Masalan: Kardiologiya" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Filial</label>
                <input className="input-field" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} placeholder="Asosiy filial" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Telefon</label>
                <input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+998 90 000 00 00" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '22px' }}>
              <button className="btn-outline" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>Bekor qilish</button>
              <button className="btn-primary" onClick={handleSaveNurse} disabled={saving} style={{ flex: 1 }}>
                {saving ? 'Saqlanmoqda...' : (editNurse ? 'Saqlash' : 'Qo\'shish')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-bg" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box" style={{ maxWidth: '360px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>🗑️ O'chirishni tasdiqlang</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              <strong>{deleteConfirm.name}</strong> ni ro'yxatdan o'chirishni xohlaysizmi? Bu hamshiraning barcha jadvali ham o'chiriladi.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" onClick={() => setDeleteConfirm(null)} style={{ flex: 1 }}>Bekor qilish</button>
              <button onClick={confirmDelete} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
