import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Package, Activity, DollarSign, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, type }) => (
  <div className="glass-card flex-col gap-4">
    <div className="flex-row justify-between align-start" style={{ gap: '1rem' }}>
      <div className="flex-col gap-1" style={{ flex: 1, minWidth: 0 }}>
        <span className="text-secondary text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
        <h3 style={{ fontSize: '1.875rem', fontWeight: 700, wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: 1.2 }}>{value}</h3>
      </div>
      <div style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-md)', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', flexShrink: 0 }}>
        {icon}
      </div>
    </div>
    {trend !== undefined && (
      <div className="flex-row align-center gap-2" style={{ fontSize: '0.875rem' }}>
        <span style={{ 
          color: type === 'up' ? 'var(--success)' : 'var(--danger)',
          display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600
        }}>
          {type === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {trend}%
        </span>
        <span className="text-muted">vs bulan lalu</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { transactions, items, cashFlow, profile } = useContext(AppContext);

  const stats = useMemo(() => {
    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.total, 0);
    const lowStockItems = items.filter(i => i.stock < 10).length;
    
    const balance = cashFlow.reduce((acc, curr) => curr.type === 'in' ? acc + curr.amount : acc - curr.amount, 0);

    return { totalTransactions, totalRevenue, lowStockItems, balance };
  }, [transactions, items, cashFlow]);

  const chartData = useMemo(() => {
    // Generate some mock chart data based on last 7 days of cashflow
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    return days.map((day, idx) => ({
      name: day,
      Pemasukan: Math.floor(Math.random() * 5000000) + 1000000,
      Pengeluaran: Math.floor(Math.random() * 2000000) + 500000,
    }));
  }, [cashFlow]);

  return (
    <div className="flex-col gap-6 w-full">
      <div className="flex-col gap-2">
        <h1>Selamat Datang, {profile.name} 👋</h1>
        <p className="text-secondary">Ringkasan aktivitas {profile.storeName} dan kinerja hari ini.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <StatCard 
          title="Total Saldo Kas" 
          value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.balance)} 
          icon={<DollarSign size={24} />} 
          trend={12.5} type="up" 
        />
        <StatCard 
          title="Pendapatan Penjualan" 
          value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.totalRevenue)} 
          icon={<Activity size={24} />} 
          trend={8.2} type="up" 
        />
        <StatCard 
          title="Transaksi Selesai" 
          value={stats.totalTransactions.toString()} 
          icon={<TrendingUp size={24} />} 
          trend={3.1} type="down" 
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats.lowStockItems.toString()} 
          icon={<Package size={24} />} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', width: '100%', alignItems: 'start' }}>
        <div className="glass-card flex-col" style={{ height: '380px', width: '100%' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Arus Kas Minggu Ini</h3>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `Rp ${value / 1000000}M`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)}
                />
                <Area type="monotone" dataKey="Pemasukan" stroke="#10b981" fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" dataKey="Pengeluaran" stroke="#ef4444" fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card flex-col gap-4" style={{ height: '380px', overflowY: 'auto' }}>
          <h3>Transaksi Terbaru</h3>
          <div className="flex-col gap-3">
            {transactions.slice(0, 5).map(trx => (
              <div key={trx.id} className="flex-row justify-between align-center" style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', transition: 'transform 0.2s', cursor: 'default' }}>
                <div className="flex-col gap-1">
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{trx.id}</span>
                  <span className="text-xs text-secondary flex-row gap-1 align-center">
                    <Clock size={12}/> {new Date(trx.date).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className="flex-col gap-1 align-end">
                  <span className="text-accent-primary" style={{ fontWeight: 700 }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(trx.total)}
                  </span>
                  <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem' }}>{trx.paymentMethod === 'cash' ? 'Tunai' : trx.paymentMethod === 'qris' ? 'QRIS' : trx.paymentMethod === 'card' ? 'Kartu' : 'Selesai'}</span>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
               <div className="text-muted text-center mt-6">Belum ada transaksi hari ini.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
