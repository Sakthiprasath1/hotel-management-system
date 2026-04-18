import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, Room } from '../context/AuthContext';
import { CreditCard, Smartphone, CheckCircle, ChevronLeft, Calendar, ShieldCheck } from 'lucide-react';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setReservations, reservations } = useAuth();
  const room = location.state?.room as Room;

  const [method, setMethod] = useState<'card' | 'upi'>('card');
  const [bookingDates, setBookingDates] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!room) {
    return (
      <div className="content" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2>No room selected</h2>
        <button className="btn" onClick={() => navigate('/room-search')}>Go Back</button>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!bookingDates) {
      alert("Please select your booking dates.");
      return;
    }

    setIsProcessing(true);
    
    const newReservation = {
      id: 'RES-' + Math.floor(Math.random() * 10000),
      userId: user?.id || 'guest',
      guestName: user?.name || 'Guest User',
      dates: bookingDates,
      roomId: room.id,
      roomName: room.name,
      status: 'Confirmed',
      amount: room.price + 500,
      paymentStatus: 'Paid'
    };

    try {
      const baseUrl = `http://${window.location.hostname}:5001`;
      const res = await fetch(`${baseUrl}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReservation)
      });
      
      if (res.ok) {
        setReservations([...reservations, await res.json()]);
        // Simulate processing time
        setTimeout(() => {
          setIsProcessing(false);
          alert("Payment Successful! Your room is booked.");
          navigate('/my-bookings');
        }, 1500);
      }
    } catch (e) {
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="page-header">
        <button className="btn-icon" onClick={() => navigate(-1)}><ChevronLeft /></button>
        <h2 className="page-title">Secure Checkout</h2>
      </div>

      <div className="main-container" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Side: Payment Details */}
        <div className="card glass-card" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Select Payment Method</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div 
              className={`card ${method === 'card' ? 'active' : ''}`} 
              onClick={() => setMethod('card')}
              style={{ 
                cursor: 'pointer', 
                padding: '20px', 
                textAlign: 'center',
                border: method === 'card' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                backgroundColor: method === 'card' ? 'rgba(79, 70, 229, 0.05)' : 'white'
              }}
            >
              <CreditCard size={32} color={method === 'card' ? 'var(--primary)' : '#64748b'} style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 600 }}>Credit/Debit Card</div>
            </div>
            <div 
              className={`card ${method === 'upi' ? 'active' : ''}`} 
              onClick={() => setMethod('upi')}
              style={{ 
                cursor: 'pointer', 
                padding: '20px', 
                textAlign: 'center',
                border: method === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                backgroundColor: method === 'upi' ? 'rgba(79, 70, 229, 0.05)' : 'white'
              }}
            >
              <Smartphone size={32} color={method === 'upi' ? 'var(--primary)' : '#64748b'} style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 600 }}>UPI / NetBanking</div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Booking Duration</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: '#64748b' }} />
              <input 
                type="text" 
                placeholder="e.g. Oct 20, 2026 - Oct 25, 2026" 
                value={bookingDates}
                onChange={e => setBookingDates(e.target.value)}
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          {method === 'card' ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Card Number</label>
                <input type="text" placeholder="xxxx xxxx xxxx xxxx" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>CVV</label>
                  <input type="password" placeholder="***" />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Scan QR Code or enter VPA ID after clicking Pay.</p>
            </div>
          )}

          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
            <ShieldCheck size={18} />
            Your payment is encrypted and 100% secure.
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="card" style={{ padding: '32px', background: 'white', position: 'sticky', top: '120px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <img src={room.image} style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 700 }}>{room.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{room.type} Room • {room.roomNo}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Room Price</span>
              <span>₹{room.price.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Service Fee</span>
              <span>₹500</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>GST (5%)</span>
              <span>Included</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', marginBottom: '32px' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{(room.price + 500).toLocaleString()}</span>
          </div>

          <button 
            className="premium-btn" 
            style={{ width: '100%', padding: '16px' }}
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Validating...' : `Pay ₹${(room.price + 500).toLocaleString()}`}
          </button>
        </div>

      </div>
    </div>
  );
}
