import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import api from '../api';
import { User, Phone, Save, Key, UserCircle, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const Profil = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.get('/auth/me');
      setUser(data);
      setFormData({
        name: data.name,
        phone: data.phone || '',
        password: ''
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/auth/profile', formData);
      toast.success('Профил муваффақиятли янгиланди');
      fetchProfile();
    } catch (error) {
      toast.error('Хатолик юз берди');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <MainLayout title="Профил"><div>Юкланмоқда...</div></MainLayout>;

  return (
    <MainLayout title="Шахсий Профил">
      <div className="max-w-4xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="md:col-span-1">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center ring-1 ring-slate-900/5">
                <div className="w-28 h-28 rounded-full bg-slate-50 mx-auto mb-6 flex items-center justify-center border-2 border-primary/20 relative group overflow-hidden shadow-inner">
                   {user?.photo ? (
                       <img src={`http://localhost:9000/uploads/${user.photo}`} className="w-full h-full object-cover" />
                   ) : (
                       <UserCircle className="w-20 h-20 text-slate-300" />
                   )}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                <p className="text-sm font-medium text-primary mt-1 uppercase tracking-wide">{user?.role}</p>
                
                <div className="mt-8 space-y-4 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                        <User size={16} className="text-slate-400" />
                        <span>@{user?.username}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                        <MapPin size={16} className="text-slate-400" />
                        <span>{user?.Branch?.name || 'Bosh Direktor'}</span>
                    </div>
                </div>
             </div>
          </div>

          {/* Form Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
                <div className="px-8 py-6 border-b border-slate-50">
                   <h3 className="font-bold text-slate-900">Маълумотларни таҳрирлаш</h3>
                </div>
                <form onSubmit={handleUpdate} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-slate-700">Тўлиқ исм</label>
                           <input 
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-slate-700">Телефон</label>
                           <input 
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                           />
                        </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-slate-700">Янги парол (ихтиёрий)</label>
                       <div className="relative">
                          <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                             type="password"
                             className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                             placeholder="Ўзгартирмаслик учун бўш қолдиринг"
                             value={formData.password}
                             onChange={e => setFormData({...formData, password: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="pt-4">
                        <button 
                           type="submit" 
                           className="w-full md:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
                           disabled={saving}
                        >
                           <Save size={18} />
                           {saving ? 'Сақланмоқда...' : 'Сақлаш'}
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profil;
