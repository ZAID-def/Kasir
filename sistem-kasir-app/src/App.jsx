import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transaksi from './pages/Transaksi';
import Audit from './pages/Audit';
import Keuangan from './pages/Keuangan';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="transaksi" element={<Transaksi />} />
        <Route path="audit" element={<Audit />} />
        <Route path="keuangan" element={<Keuangan />} />
      </Route>
    </Routes>
  );
}

export default App;
