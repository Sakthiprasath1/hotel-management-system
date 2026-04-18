import { useAuth } from '../context/AuthContext';
import { Bed, Users, CreditCard, Activity, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { rooms, reservations, payments, user } = useAuth();

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(h => h.status === 'Occupied').length;
  const availableRooms = rooms.filter(h => h.status === 'Available').length;
  const activeBookings = reservations.length;
  
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0) + reservations.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">Welcome back, {user?.name}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Here's what's happening with Vibe Stays today.</p>
        </div>
        <div className="avatar-wrapper" style={{ padding: '8px 20px', background: 'white', border: '1px solid var(--border-color)' }}>
          <TrendingUp size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>+12% Revenue this week</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}><Activity size={80} /></div>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Occupancy Rate</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{occupancyRate}%</p>
          <div style={{ marginTop: '12px', height: '6px', background: '#e2e8f0', borderRadius: '100px' }}>
             <div style={{ width: `${occupancyRate}%`, height: '100%', background: 'var(--primary)', borderRadius: '100px' }}></div>
          </div>
        </div>

        <div className="card glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Rooms Available</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>{availableRooms}</p>
            <span style={{ color: '#64748b', fontWeight: 500 }}>/ {totalRooms} total</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '8px', fontWeight: 600 }}>Ready for new check-ins</p>
        </div>

        <div className="card glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Active Bookings</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>{activeBookings}</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>Confirmed reservations</p>
        </div>

        <div className="card glass-card" style={{ padding: '24px', border: '2px solid rgba(79, 70, 229, 0.1)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Total Revenue</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{totalRevenue.toLocaleString()}</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>Payments & Pending</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Quick Room Status</h3>
            <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>View All</button>
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            {rooms.slice(0, 6).map(room => (
              <div key={room.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid transparent', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <Bed size={20} style={{ margin: '0 auto', color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{room.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{room.roomNo} • {room.type}</div>
                  </div>
                </div>
                <span className={`status-badge ${room.status.toLowerCase()}`} style={{ 
                  alignSelf: 'center',
                  background: room.status === 'Available' ? '#dcfce7' : (room.status === 'Occupied' ? '#f1f5f9' : '#fee2e2'),
                  color: room.status === 'Available' ? '#166534' : (room.status === 'Occupied' ? '#475569' : '#991b1b')
                }}>
                  {room.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Recent Bookings</h3>
          {reservations.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {reservations.slice(-4).reverse().map(res => (
                <div key={res.id} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                   <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{res.guestName}</div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.dates}</div>
                   <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>₹{res.amount.toLocaleString()}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>{res.paymentStatus}</span>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <Activity size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

