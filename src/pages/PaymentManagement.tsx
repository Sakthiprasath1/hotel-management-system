import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, ArrowUpRight, ArrowDownRight, Search, Clock } from 'lucide-react';

export default function PaymentManagement() {
  const { payments, reservations, setPayments } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const totalPayments = payments.reduce((acc, p) => acc + p.amount, 0);
  const pendingPayments = reservations.filter(r => r.paymentStatus === 'Pending').reduce((acc, r) => acc + r.amount, 0);
  const refundCount = payments.filter(p => p.status === 'Refunded').length;

  const handleProcessRefund = async (paymentId: string) => {
    if (!window.confirm("Confirm refund for this payment?")) return;

    try {
      const baseUrl = `http://${window.location.hostname}:5001`;
      const res = await fetch(`${baseUrl}/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Refunded' })
      });
      if (res.ok) {
        setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'Refunded' } : p));
        alert("Refund processed successfully.");
      }
    } catch (e) {
      alert("Failed to process refund.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Financial & Payment Oversight</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary">Download Statement</button>
          <button className="btn">Add Transaction</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card glass-card" style={{ borderLeft: '4px solid #27ae60' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Net Revenue</span>
            <ArrowUpRight size={20} color="#27ae60" />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>₹{totalPayments.toLocaleString()}</p>
          <p style={{ fontSize: '0.8rem', color: '#27ae60', marginTop: '4px' }}>+12.5% from last month</p>
        </div>
        
        <div className="card glass-card" style={{ borderLeft: '4px solid #f39c12' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Receivables</span>
            <Clock size={20} color="#f39c12" />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>₹{pendingPayments.toLocaleString()}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>14 outstanding bookings</p>
        </div>

        <div className="card glass-card" style={{ borderLeft: '4px solid #e74c3c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Refunds</span>
            <ArrowDownRight size={20} color="#e74c3c" />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>{refundCount}</p>
          <p style={{ fontSize: '0.8rem', color: '#e74c3c', marginTop: '4px' }}>Across 3 room types</p>
        </div>
      </div>

      <div className="card glass-card" style={{ padding: 0 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Transaction History</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f5f5f5', padding: '8px 16px', borderRadius: '8px' }}>
            <Search size={18} color="#666" />
            <input 
              style={{ border: 'none', background: 'transparent', width: '250px', color: '#000' }} 
              placeholder="Search by ID or Guest..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Transaction Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>#{p.id}</td>
                <td style={{ color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td style={{ fontWeight: 700 }}>₹{p.amount.toLocaleString()}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} /> {p.method}
                  </div>
                </td>
                <td>
                   <span className={`status-badge ${p.status.toLowerCase()}`}>
                     {p.status}
                   </span>
                </td>
                <td>
                  {p.status === 'Completed' && (
                    <button className="btn-secondary btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleProcessRefund(p.id)}>Issue Refund</button>
                  )}
                  {p.status === 'Refunded' && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Processed</span>}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>No transactions recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
