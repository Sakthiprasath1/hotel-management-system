import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Receipt, Clock, CheckCircle, XCircle, Info, Bed } from 'lucide-react';

export default function MyBookings() {
  const { user, reservations, rooms, setReservations } = useAuth();
  
  // Filter bookings for the current guest
  const myReservations = reservations.filter(res => res.userId === user?.id);

  const getRoomInfo = (roomId: string) => {
    return rooms.find(h => h.id === roomId);
  };

  const handleCancelBooking = async (resId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking? Cancellation policies may apply.")) return;

    try {
      // Update local state instead of fetch
      setReservations(reservations.map(r => r.id === resId ? { ...r, status: 'Cancelled', paymentStatus: 'Refunded' } : r));
      alert("Booking cancelled successfully.");
    } catch (e) {
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="page-title">My Room Bookings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your upcoming stays and past reservations at Hotel Vibe.</p>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {myReservations.length === 0 ? (
          <div className="card glass-card" style={{ textAlign: 'center', padding: '80px 40px', background: 'white', color: '#000' }}>
             <Calendar size={64} style={{ marginBottom: '24px', opacity: 0.1 }} color="var(--primary)" />
             <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#000' }}>No bookings yet</h3>
             <p style={{ color: '#333', maxWidth: '400px', margin: '0 auto 24px' }}>Discover our premium rooms and start planning your next getaway with us.</p>
             <button className="premium-btn" style={{ width: 'auto', padding: '12px 32px' }} onClick={() => window.location.href='/'}>Explore Rooms</button>
          </div>
        ) : (
          myReservations.map(res => {
            const room = getRoomInfo(res.roomId);
            return (
              <div key={res.id} className="card room-booking-card" style={{ display: 'flex', gap: '32px', padding: '32px', alignItems: 'center', background: 'white', color: '#000', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                <div style={{ width: '160px', height: '120px', borderRadius: '16px', background: '#f1f5f9', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                   <img src={room?.image || '/assets/rooms/room_standard.png'} alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#000' }}>{room?.name || 'Vibe Premium Room'}</h3>
                    <span className={`status-badge ${res.status.toLowerCase().replace(' ', '-')}`} style={{ 
                      background: res.status === 'Confirmed' ? '#dcfce7' : '#f1f5f9',
                      color: res.status === 'Confirmed' ? '#166534' : '#475569',
                      padding: '6px 16px',
                      borderRadius: '100px',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}>{res.status}</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#333', fontSize: '0.95rem' }}>
                      <Calendar size={18} color="var(--primary)" /> {res.dates}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#333', fontSize: '0.95rem' }}>
                      <Bed size={18} color="var(--primary)" /> Room {room?.roomNo || 'N/A'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#333', fontSize: '0.95rem' }}>
                      <Receipt size={18} color="var(--primary)" /> ₹{res.amount.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem', borderRadius: '10px', color: '#000', borderColor: '#000' }}>
                      <Info size={16} style={{ marginRight: '6px' }} /> View Details
                    </button>
                    {(res.status === 'Checked Out' || res.paymentStatus === 'Paid') && (
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '8px 20px', fontSize: '0.9rem', color: '#10b981', border: '1px solid #10b981', borderRadius: '10px' }}
                        onClick={() => alert(`Downloading invoice for Booking ${res.id}...`)}
                      >
                        <Receipt size={16} style={{ marginRight: '6px' }} /> Download Invoice
                      </button>
                    )}
                    {(res.status !== 'Checked Out' && res.status !== 'Cancelled') && (
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '8px 20px', fontSize: '0.9rem', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '10px' }}
                        onClick={() => handleCancelBooking(res.id)}
                      >
                        <XCircle size={16} style={{ marginRight: '6px' }} /> Cancel Booking
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'center', borderLeft: '1px solid #ccc', paddingLeft: '32px', minWidth: '150px' }}>
                   <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Booking ID</p>
                   <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#000' }}>{res.id}</p>
                   <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: res.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                     {res.paymentStatus === 'Paid' ? <CheckCircle size={18} /> : <Clock size={18} />}
                     {res.paymentStatus}
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
