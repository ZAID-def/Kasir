import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('sistemKasir_items');
    return saved ? JSON.parse(saved) : [
      { id: '1', barcode: '123456789', name: 'Kopi Susu', price: 15000, stock: 50, category: 'Minuman' },
      { id: '2', barcode: '987654321', name: 'Roti Bakar', price: 12000, stock: 30, category: 'Makanan' },
      { id: '3', barcode: '111222333', name: 'Air Mineral 600ml', price: 5000, stock: 100, category: 'Minuman' },
    ];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('sistemKasir_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [cashFlow, setCashFlow] = useState(() => {
    const saved = localStorage.getItem('sistemKasir_cashFlow');
    return saved ? JSON.parse(saved) : [
      { id: 'init-1', date: new Date().toISOString(), type: 'in', amount: 500000, description: 'Modal Awal Kasir' }
    ];
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('sistemKasir_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Admin Store',
      role: 'Kasir Utama',
      storeName: 'KasirPro Store'
    };
  });

  useEffect(() => {
    localStorage.setItem('sistemKasir_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('sistemKasir_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sistemKasir_cashFlow', JSON.stringify(cashFlow));
  }, [cashFlow]);

  useEffect(() => {
    localStorage.setItem('sistemKasir_profile', JSON.stringify(profile));
  }, [profile]);

  // Actions
  const addItem = (item) => setItems([...items, { ...item, id: Date.now().toString() }]);
  const updateItem = (id, updated) => setItems(items.map(i => i.id === id ? { ...i, ...updated } : i));
  const deleteItem = (id) => setItems(items.filter(i => i.id !== id));

  const addTransaction = (transaction) => {
    // Reduce stock
    let updatedItems = [...items];
    transaction.items.forEach(cartItem => {
      const idx = updatedItems.findIndex(i => i.id === cartItem.id);
      if (idx !== -1) {
        updatedItems[idx] = { ...updatedItems[idx], stock: updatedItems[idx].stock - cartItem.qty };
      }
    });
    setItems(updatedItems);

    const newTrx = { ...transaction, id: 'TRX-' + Date.now().toString() };
    setTransactions([newTrx, ...transactions]);

    // Add to cashFlow
    addCashFlow({
      type: 'in',
      amount: transaction.total,
      description: `Penjualan ${newTrx.id}`
    });
  };

  const addCashFlow = (flow) => {
    setCashFlow([{ ...flow, id: 'CF-' + Date.now().toString(), date: new Date().toISOString() }, ...cashFlow]);
  };

  return (
    <AppContext.Provider value={{
      items, addItem, updateItem, deleteItem,
      transactions, addTransaction,
      cashFlow, addCashFlow,
      profile, setProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};
