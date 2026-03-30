import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowUpCircle, ArrowDownCircle, PlusCircle, MinusCircle, CheckCircle, Clock } from 'lucide-react';

const Keuangan = () => {
  const { cashFlow, addCashFlow, transactions } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('cashflow');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'in',
    amount: '',
    description: ''
  });

  const totalIn = cashFlow.filter(c => c.type === 'in').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOut = cashFlow.filter(c => c.type === 'out').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIn - totalOut;

  const handleSaveFlow = (e) => {
    e.preventDefault();
    addCashFlow({
      type: formData.type,
      amount: Number(formData.amount),
      description: formData.description
    });
    setIsModalOpen(false);
    setFormData({ type: 'in', amount: '', description: '' });
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex-col gap-6 w-full fade-in">
      <div className="flex-col gap-2">
        <h1>Keuangan & Histori</h1>
        <p className="text-secondary">Kelola arus kas, cek saldo akhir, dan pantau riwayat transaksi berhasil.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card flex-col gap-2" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(16, 185, 129, 0.1))', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <span className="text-secondary text-sm">Pemasukan (In)</span>
          <h2 style={{ color: 'var(--success)' }}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalIn)}</h2>
          <ArrowUpCircle className="text-success" size={24} style={{ alignSelf: 'flex-end', opacity: 0.5 }}/>
        </div>
        <div className="glass-card flex-col gap-2" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(239, 68, 68, 0.1))', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <span className="text-secondary text-sm">Pengeluaran (Out)</span>
          <h2 style={{ color: 'var(--danger)' }}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalOut)}</h2>
          <ArrowDownCircle className="text-danger" size={24} style={{ alignSelf: 'flex-end', opacity: 0.5 }}/>
        </div>
        <div className="glass-card flex-col gap-2" style={{ background: 'linear-gradient(135deg, var(--bg-secondary), rgba(59, 130, 246, 0.2))', border: '1px solid var(--accent-glow)' }}>
          <span className="text-secondary text-sm">Total Saldo Kas</span>
          <h2 style={{ color: 'var(--text-primary)' }}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(balance)}</h2>
          <div style={{ alignSelf: 'flex-end', opacity: 0.5, color: 'var(--accent-primary)' }}>Rp</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-row gap-4 align-center border-b pb-2 mt-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab('cashflow')}
          style={{ 
            padding: '0.5rem 1rem', 
            borderBottom: activeTab === 'cashflow' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'cashflow' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: 600
          }}
        >
          Riwayat Arus Kas
        </button>
        <button 
          onClick={() => setActiveTab('transactions')}
          style={{ 
            padding: '0.5rem 1rem', 
            borderBottom: activeTab === 'transactions' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'transactions' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: 600
          }}
        >
          Riwayat Transaksi POS
        </button>
      </div>

      {/* Tab Content */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {activeTab === 'cashflow' ? (
          <div className="flex-col w-full">
            <div className="flex-row justify-between align-center p-4 border-b" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3>Daftar Arus Kas</h3>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                <span>Catat Mutasi</span>
              </button>
            </div>
            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <th>Tanggal & Waktu</th>
                    <th>ID</th>
                    <th>Tipe</th>
                    <th>Deskripsi</th>
                    <th style={{ textAlign: 'right' }}>Jumlah (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlow.map(flow => (
                    <tr key={flow.id}>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex-row gap-2 align-center">
                          <Clock size={16} /> 
                          {formatDate(flow.date)}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>{flow.id}</td>
                      <td>
                        {flow.type === 'in' 
                          ? <span className="badge badge-success"><div className="flex-row gap-1"><PlusCircle size={12}/> Masuk</div></span> 
                          : <span className="badge badge-danger"><div className="flex-row gap-1"><MinusCircle size={12}/> Keluar</div></span>
                        }
                      </td>
                      <td>{flow.description}</td>
                      <td style={{ 
                        textAlign: 'right', fontWeight: 600, 
                        color: flow.type === 'in' ? 'var(--success)' : 'var(--danger)' 
                      }}>
                        {flow.type === 'in' ? '+' : '-'} {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(flow.amount)}
                      </td>
                    </tr>
                  ))}
                  {cashFlow.length === 0 && (
                    <tr><td colSpan="5" className="text-center text-muted p-8">Belum ada catatan mutasi kas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-col w-full">
            <div className="flex-row justify-between align-center p-4 border-b" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3>Transaksi Penjualan (POS)</h3>
            </div>
            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <th>Tanggal & Waktu</th>
                    <th>ID Transaksi</th>
                    <th>Total Item</th>
                    <th>Detail Barang</th>
                    <th>Pembayaran</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Total (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(trx => (
                    <tr key={trx.id}>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex-row gap-2 align-center">
                          <Clock size={16} /> 
                          {formatDate(trx.date)}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontWeight: 600 }}>{trx.id}</td>
                      <td>{trx.items.reduce((acc, curr) => acc + curr.qty, 0)} item</td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {trx.items.map(i => `${i.name} (${i.qty}x)`).join(', ')}
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                          {trx.paymentMethod === 'cash' ? 'Tunai' : trx.paymentMethod === 'qris' ? 'QRIS' : trx.paymentMethod === 'card' ? 'Kartu' : 'Tunai'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success flex-row gap-1 align-center"><CheckCircle size={12}/> Sukses</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(trx.total)}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr><td colSpan="7" className="text-center text-muted p-8" style={{ padding: '2rem' }}>Belum ada transaksi penjualan yang berhasil.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-card flex-col gap-6" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <div className="flex-row justify-between align-center border-b pb-4">
              <h3 style={{ fontSize: '1.25rem' }}>Catat Mutasi / Arus Kas</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-primary">✕</button>
            </div>
            
            <form onSubmit={handleSaveFlow} className="flex-col gap-4">
              <div className="flex-col gap-1">
                <label className="text-sm font-semibold">Tipe Mutasi</label>
                <select className="input-field" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="in">Pemasukan / Modal Masuk</option>
                  <option value="out">Pengeluaran / Beli Stok</option>
                </select>
              </div>
              <div className="flex-col gap-1">
                <label className="text-sm font-semibold">Nominal (Rp)</label>
                <input required type="number" min="1" className="input-field" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Contoh: 150000" />
              </div>
              <div className="flex-col gap-1">
                <label className="text-sm font-semibold">Keterangan / Deskripsi</label>
                <input required className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Contoh: Beli stok gelas plastik" />
              </div>
              
              <div className="flex-row gap-4 mt-4">
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Kas</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Keuangan;
