import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ScanBarcode, Trash2, Search, Plus, Minus, CreditCard, Banknote, QrCode } from 'lucide-react';

const Transaksi = () => {
  const { items, addTransaction } = useContext(AppContext);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // cash, qris, card
  const [amountGiven, setAmountGiven] = useState('');

  // Filter items for manual selecting
  const filteredItems = items.filter(
    i => i.name.toLowerCase().includes(search.toLowerCase()) || i.barcode.includes(search)
  );

  const getCartTotal = () => cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => 
          p.id === item.id 
          ? { ...p, qty: Math.min(p.qty + 1, item.stock) } 
          : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const itemStock = items.find(i => i.id === id)?.stock || 0;
        const newQty = Math.max(1, Math.min(p.qty + delta, itemStock));
        return { ...p, qty: newQty };
      }
      return p;
    }));
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    setPaymentModalOpen(true);
    setPaymentMethod('cash');
    setAmountGiven('');
  };

  const processPayment = () => {
    const total = getCartTotal();
    let change = 0;
    
    if (paymentMethod === 'cash') {
      const given = Number(amountGiven);
      if (given < total) {
        alert('Jumlah uang tunai kurang dari total belanja!');
        return;
      }
      change = given - total;
    }

    addTransaction({
      items: cart,
      total: total,
      date: new Date().toISOString(),
      paymentMethod,
      change
    });
    
    setCart([]);
    setPaymentModalOpen(false);
    
    if (paymentMethod === 'cash') {
      alert(`Transaksi Berhasil! \nKembalian: Rp ${change.toLocaleString('id-ID')}`);
    } else {
      alert('Transaksi Berhasil!');
    }
  };

  useEffect(() => {
    if (scanning && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      
      scanner.render((decodedText) => {
        // Success scan
        const found = items.find(i => i.barcode === decodedText);
        if (found) {
          handleAddToCart(found);
          // Optional: sound or flash effect
        } else {
          alert('Barang tidak ditemukan di database.');
        }
      }, (error) => {
        // Ignored. continuous scanning.
      });

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error('Failed to clear scanner', error));
        scannerRef.current = null;
      }
    };
  }, [scanning, items]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 3fr)', gap: '1.5rem', height: '100%' }}>
      {/* Left side: Products and Scanner */}
      <div className="flex-col gap-4">
        <div className="glass-card flex-row justify-between w-full" style={{ padding: '1rem' }}>
          <div className="flex-row gap-2" style={{ flex: 1, position: 'relative' }}>
            <Search size={20} className="text-secondary" style={{ position: 'absolute', left: '1rem' }} />
            <input 
              type="text" 
              className="input-field" 
              style={{ paddingLeft: '3rem' }} 
              placeholder="Cari barang atau scan barcode..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            className={`btn ${scanning ? 'btn-danger' : 'btn-primary'}`} 
            style={{ marginLeft: '1rem' }}
            onClick={() => setScanning(!scanning)}
          >
            <ScanBarcode size={20} />
            {scanning ? 'Stop Scanner' : 'Toggle Scanner'}
          </button>
        </div>

        {/* Scanner view */}
        {scanning && (
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
            <div id="reader" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', overflow: 'hidden' }}></div>
          </div>
        )}

        {/* Product Grid */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem',
          maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', paddingRight: '0.5rem'
        }}>
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="glass-card flex-col gap-2" 
              style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s', ...(item.stock === 0 ? { opacity: 0.5, pointerEvents: 'none'} : {})}}
              onClick={() => handleAddToCart(item)}
            >
              <div className="flex-row justify-between">
                <span className="badge badge-primary">{item.category}</span>
                <span className="text-sm text-secondary">Sisa: {item.stock}</span>
              </div>
              <h3 style={{ marginTop: '0.5rem', fontSize: '1rem' }}>{item.name}</h3>
              <p className="text-accent-primary" style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
              </p>
              <p className="text-xs text-muted">Barcode: {item.barcode}</p>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              Tidak menemukan barang.
            </div>
          )}
        </div>
      </div>

      {/* Right side: Cart */}
      <div className="glass-card flex-col gap-4" style={{ height: 'calc(100vh - 120px)', position: 'sticky', top: '90px' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Keranjang Belanja</h2>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
          {cart.length === 0 ? (
            <div className="text-muted text-center w-full" style={{ marginTop: '2rem' }}>
              Belum ada barang di keranjang.
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex-row gap-2 justify-between align-start" style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
                <div className="flex-col gap-1 w-full text-sm">
                  <div className="flex-row justify-between w-full">
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-danger" style={{ padding: 0 }}><Trash2 size={16} /></button>
                  </div>
                  <div className="flex-row justify-between align-center" style={{ marginTop: '0.5rem' }}>
                    <span className="text-secondary">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}/pcs</span>
                    <div className="flex-row gap-2 align-center">
                      <button onClick={() => updateQty(item.id, -1)} className="btn btn-outline" style={{ padding: '0.25rem', borderRadius: '4px' }}><Minus size={14} /></button>
                      <span style={{ width: '20px', textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="btn btn-outline" style={{ padding: '0.25rem', borderRadius: '4px' }}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex-col gap-4 pt-4" style={{ borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
          <div className="flex-row justify-between text-secondary">
            <span>Total Item</span>
            <span>{cart.reduce((acc, curr) => acc + curr.qty, 0)}</span>
          </div>
          <div className="flex-row justify-between" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            <span>Total Bayar</span>
            <span style={{ color: 'var(--accent-primary)' }}>
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(getCartTotal())}
            </span>
          </div>
          <button 
            className="btn btn-primary w-full" 
            style={{ padding: '1rem', fontSize: '1.125rem', marginTop: '0.5rem' }}
            disabled={cart.length === 0}
            onClick={handleCheckoutClick}
          >
            <CreditCard size={20} />
            Selesaikan Transaksi
          </button>
        </div>
      </div>

      {paymentModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-card flex-col gap-6" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <div className="flex-row justify-between align-center border-b pb-4">
              <h3 style={{ fontSize: '1.25rem' }}>Pilih Metode Pembayaran</h3>
              <button onClick={() => setPaymentModalOpen(false)} className="text-secondary hover:text-primary">✕</button>
            </div>
            
            <div className="flex-col gap-4">
              <div className="flex-row justify-between" style={{ fontSize: '1.5rem', fontWeight: 700, paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <span>Total</span>
                <span className="text-accent-primary">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(getCartTotal())}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <button 
                  className={`btn ${paymentMethod === 'cash' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flexDirection: 'column', padding: '1rem', gap: '0.5rem', height: 'auto' }}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <Banknote size={24} />
                  <span style={{ fontSize: '0.875rem' }}>Tunai</span>
                </button>
                <button 
                  className={`btn ${paymentMethod === 'qris' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flexDirection: 'column', padding: '1rem', gap: '0.5rem', height: 'auto' }}
                  onClick={() => setPaymentMethod('qris')}
                >
                  <QrCode size={24} />
                  <span style={{ fontSize: '0.875rem' }}>QRIS</span>
                </button>
                <button 
                  className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flexDirection: 'column', padding: '1rem', gap: '0.5rem', height: 'auto' }}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={24} />
                  <span style={{ fontSize: '0.875rem' }}>Kartu</span>
                </button>
              </div>

              {paymentMethod === 'cash' && (
                <div className="flex-col gap-1 mt-2 fade-in">
                  <label className="text-sm font-semibold">Jumlah Uang Diterima (Rp)</label>
                  <input 
                    type="number" 
                    min={getCartTotal()} 
                    className="input-field" 
                    value={amountGiven} 
                    onChange={e => setAmountGiven(e.target.value)} 
                    placeholder="Contoh: 50000" 
                    autoFocus
                  />
                  {Number(amountGiven) > 0 && Number(amountGiven) >= getCartTotal() && (
                    <div className="flex-row justify-between text-sm mt-2 p-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', color: 'var(--success)' }}>
                      <span>Kembalian:</span>
                      <span style={{ fontWeight: 600 }}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(amountGiven) - getCartTotal())}</span>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'qris' && (
                <div className="flex-col gap-2 align-center mt-2 fade-in p-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <QrCode size={100} className="text-accent-primary" />
                  <p className="text-center text-sm text-secondary">Minta pelanggan memindai QRIS ini dengan aplikasi E-Wallet atau M-Banking.</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="flex-col gap-2 align-center mt-2 fade-in p-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <CreditCard size={60} className="text-secondary" />
                  <p className="text-center text-sm text-secondary">Silahkan tap atau masukkan kartu debit/kredit pelanggan pada mesin EDC.</p>
                </div>
              )}

              <button 
                className="btn btn-primary w-full mt-4" 
                style={{ padding: '1rem', fontSize: '1.125rem' }}
                onClick={processPayment}
                disabled={paymentMethod === 'cash' && (Number(amountGiven) < getCartTotal())}
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        #reader canvas, #reader video { max-width: 100% !important; border-radius: 8px; }
        #reader__dashboard_section_csr button { background-color: var(--accent-primary); border: none; padding: 0.5rem 1rem; border-radius: 4px; color: white; cursor:pointer;}
      `}} />
    </div>
  );
};

export default Transaksi;
