import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Plus, Edit3, Trash2, Box, PackagePlus, ScanBarcode } from 'lucide-react';

const Audit = () => {
  const { items, addItem, updateItem, deleteItem } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    price: '',
    stock: '',
    category: ''
  });

  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scanning && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader-audit",
        { fps: 10, qrbox: { width: 250, height: 150 } },
        false
      );
      
      scanner.render((decodedText) => {
        setFormData(prev => ({ ...prev, barcode: decodedText }));
        setScanning(false);
      }, (error) => {});

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  const closeModal = () => {
    setScanning(false);
    setIsModalOpen(false);
  };

  const openModal = (item = null) => {
    setScanning(false);
    if (item) {
      setFormData({
        barcode: item.barcode,
        name: item.name,
        price: item.price,
        stock: item.stock,
        category: item.category
      });
      setEditingId(item.id);
    } else {
      setFormData({ barcode: '', name: '', price: '', stock: '', category: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateItem(editingId, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
    } else {
      addItem({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus barang ini dari database?')) {
      deleteItem(id);
    }
  };

  return (
    <div className="flex-col gap-6 w-full fade-in">
      <div className="glass-panel flex-row justify-between align-center" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-lg)' }}>
        <div className="flex-row gap-4 align-center">
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
            <Box size={32} />
          </div>
          <div className="flex-col gap-1">
            <h2>Audit & Inventaris Barang</h2>
            <p className="text-secondary text-sm">Kelola stok barang, harga, dan barcode.</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <PackagePlus size={20} /> Tambah Barang Baru
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <th>Barcode</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Harga Jual</th>
                <th>Stok</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{item.barcode}</td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td><span className="badge badge-primary">{item.category}</span></td>
                  <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: item.stock < 10 ? 'var(--danger)' : 'var(--success)' }}>
                      {item.stock} unit
                    </span>
                  </td>
                  <td>
                    {item.stock > 0 
                      ? <span className="badge badge-success">Tersedia</span> 
                      : <span className="badge badge-danger">Habis</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex-row gap-2" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '6px' }} onClick={() => openModal(item)}>
                        <Edit3 size={16} />
                      </button>
                      <button className="btn btn-outline text-danger" style={{ padding: '0.4rem', borderRadius: '6px', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                    Belum ada data barang. Silahkan tambah barang baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-card flex-col gap-6" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div className="flex-row justify-between align-center border-b pb-4">
              <h3 style={{ fontSize: '1.25rem' }}>{editingId ? 'Edit Barang' : 'Tambah Barang Baru'}</h3>
              <button onClick={closeModal} className="text-secondary hover:text-primary">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="flex-col gap-4">
              <div className="flex-col gap-1">
                <label className="text-sm font-semibold">Barcode / SKU</label>
                <div className="flex-row gap-2 w-full">
                  <input required className="input-field" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} placeholder="Scan atau ketik barcode..." style={{ flex: 1 }} />
                  <button type="button" className={`btn ${scanning ? 'btn-danger' : 'btn-outline'}`} onClick={() => setScanning(!scanning)} style={{ padding: '0.75rem' }} title="Scan Barcode">
                    <ScanBarcode size={20} />
                  </button>
                </div>
                {scanning && (
                  <div className="glass-panel mt-2" style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <div id="reader-audit" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', overflow: 'hidden' }}></div>
                  </div>
                )}
              </div>
              <div className="flex-col gap-1">
                <label className="text-sm font-semibold">Nama Barang</label>
                <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Kopi Susu Aren" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="flex-col gap-1">
                  <label className="text-sm font-semibold">Kategori</label>
                  <input className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Minuman, Makanan, dll" />
                </div>
                <div className="flex-col gap-1">
                  <label className="text-sm font-semibold">Stok Unit</label>
                  <input required type="number" min="0" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="0" />
                </div>
              </div>
              <div className="flex-col gap-1">
                <label className="text-sm font-semibold">Harga Jual (Rp)</label>
                <input required type="number" min="0" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="15000" />
              </div>
              
              <div className="flex-row justify-center gap-4 mt-6">
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={closeModal}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Simpan Perubahan' : 'Tambahkan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        #reader-audit canvas, #reader-audit video { max-width: 100% !important; border-radius: 8px; }
        #reader-audit__dashboard_section_csr button { background-color: var(--accent-primary); border: none; padding: 0.5rem 1rem; border-radius: 4px; color: white; cursor:pointer;}
      `}} />
    </div>
  );
};

export default Audit;
