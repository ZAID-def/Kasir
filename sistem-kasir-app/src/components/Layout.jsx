import React, { useState, useContext } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  PackageSearch, 
  Wallet,
  Menu,
  X,
  CreditCard,
  Settings,
  User,
  Download,
  Upload
} from 'lucide-react';

const Layout = () => {
  const { profile, setProfile } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState({ name: '', role: '', storeName: '' });
  const location = useLocation();

  const handleOpenProfile = () => {
    setTempProfile(profile);
    setProfileModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(tempProfile);
    setProfileModalOpen(false);
  };

  const handleExportData = () => {
    const data = {
      items: localStorage.getItem('sistemKasir_items'),
      transactions: localStorage.getItem('sistemKasir_transactions'),
      cashFlow: localStorage.getItem('sistemKasir_cashFlow'),
      profile: localStorage.getItem('sistemKasir_profile')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-kasirpro-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.items) localStorage.setItem('sistemKasir_items', data.items);
        if (data.transactions) localStorage.setItem('sistemKasir_transactions', data.transactions);
        if (data.cashFlow) localStorage.setItem('sistemKasir_cashFlow', data.cashFlow);
        if (data.profile) localStorage.setItem('sistemKasir_profile', data.profile);
        alert('Data berhasil dipulihkan! Halaman akan dimuat ulang untuk memproses data baru.');
        window.location.reload();
      } catch (err) {
        alert('File backup gagal diproses. Pastikan file dalam format JSON yang benar.');
      }
    };
    reader.readAsText(file);
  };

  const navItems = [
    { path: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/transaksi', label: 'Transaksi & Scan', icon: <ShoppingCart size={20} /> },
    { path: '/audit', label: 'Audit Barang', icon: <PackageSearch size={20} /> },
    { path: '/keuangan', label: 'Keuangan', icon: <Wallet size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Overlay */}
      <div 
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40,
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        style={{
          width: 'var(--sidebar-width)',
          minWidth: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          transform: `translateX(${sidebarOpen ? '0' : '-100%'})`, 
          zIndex: 50,
          transition: 'transform 0.3s ease'
        }}
      >
        <div style={{ height: 'var(--header-height)', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <CreditCard size={28} color="var(--accent-primary)" style={{ marginRight: '0.75rem', flexShrink: 0 }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.storeName}</h2>
          <button 
            style={{ marginLeft: 'auto', display: 'flex', color: 'var(--text-secondary)' }} 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--border-radius-sm)',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 14px 0 var(--accent-glow)' : 'none',
                  gap: '0.75rem'
                }}
              >
                {item.icon}
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main 
        style={{ 
          flex: 1, 
          marginLeft: 0, // removed var(--sidebar-width) since sidebar is now toggleable overlay
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%'
        }}
      >
        <header 
          className="glass-panel"
          style={{ 
            height: 'var(--header-height)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            borderRadius: 0,
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              style={{ marginRight: '1rem', display: 'flex', color: 'var(--text-primary)' }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              {navItems.find(i => location.pathname === i.path || (i.path !== '/' && location.pathname.startsWith(i.path)))?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={handleOpenProfile} title="Edit Profile">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{profile.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{profile.role}</div>
            </div>
          </div>
        </header>

        <div style={{ padding: '2rem', flex: 1, width: '100%' }} className="fade-in">
          <Outlet />
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .user-info {
            display: none;
          }
          header, main > div {
             padding-left: 1rem !important;
             padding-right: 1rem !important;
          }
        }
      `}} />

      {/* Profile Edit Modal */}
      {profileModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-card flex-col gap-6 fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <div className="flex-row justify-between align-center border-b pb-4">
              <div className="flex-row gap-2 align-center">
                <Settings className="text-accent-primary" size={24}/>
                <h3 style={{ fontSize: '1.25rem' }}>Pengaturan Profil</h3>
              </div>
              <button onClick={() => setProfileModalOpen(false)} className="text-secondary hover:text-primary">✕</button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="flex-col gap-4">
              <div className="flex-col gap-1">
                <label className="text-sm font-semibold">Nama Toko</label>
                <input required className="input-field" value={tempProfile.storeName} onChange={e => setTempProfile({...tempProfile, storeName: e.target.value})} placeholder="Nama Toko" />
              </div>
              <div className="flex-col gap-1">
                <label className="text-sm font-semibold">Nama Profile Admin</label>
                <input required className="input-field" value={tempProfile.name} onChange={e => setTempProfile({...tempProfile, name: e.target.value})} placeholder="Nama Lengkap" />
              </div>
              <div className="flex-col gap-1">
                <label className="text-sm font-semibold">Jabatan / Peran</label>
                <input required className="input-field" value={tempProfile.role} onChange={e => setTempProfile({...tempProfile, role: e.target.value})} placeholder="Contoh: Manajer, Kasir" />
              </div>
              
              <div className="flex-row gap-4 mt-2">
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setProfileModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Profil</button>
              </div>
            </form>

            <div className="flex-col gap-3 mt-4 pt-4 border-t" style={{ borderTop: '1px solid var(--border-color)' }}>
              <h4 className="text-sm font-semibold mb-1">Backup & Pemulihan Data</h4>
              <p className="text-xs text-secondary mb-2">Simpan data toko Anda ke dalam file, atau pulihkan data dari perangkat lain.</p>
              
              <div className="flex-row gap-4 w-full">
                <button 
                  className="btn flex-row justify-center align-center" 
                  style={{ flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                  onClick={handleExportData}
                >
                  <Download size={16} /> Export JSON
                </button>
                <label 
                  className="btn flex-row justify-center align-center" 
                  style={{ flex: 1, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(59, 130, 246, 0.2)', cursor: 'pointer', margin: 0 }}
                >
                  <Upload size={16} /> Import Data
                  <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportData} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
