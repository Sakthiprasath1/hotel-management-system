import { useState } from 'react';
import { useAuth, Reservation } from '../context/AuthContext';
import { Search, MapPin, Users, Wifi, CheckCircle, ChevronRight } from 'lucide-react';

export default function HallSearch() {
    const { halls, user, setReservations, reservations } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [selectedHall, setSelectedHall] = useState<any>(null);
    const [bookingDates, setBookingDates] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    const filteredHalls = halls.filter(hall => {
        const matchesSearch = hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hall.hallNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || hall.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleBookNow = async () => {
        if (!selectedHall || !bookingDates || !user)
            return;
        setIsBooking(true);
        const newReservation = {
            id: 'RES-' + Math.floor(Math.random() * 10000),
            userId: user.id,
            guestName: user.name,
            dates: bookingDates,
            roomId: selectedHall.id,
            status: 'Confirmed',
            amount: selectedHall.price,
            paymentStatus: 'Pending'
        } as Reservation;

        try {
            // Update local state instead of fetch
            setReservations([...reservations, newReservation]);
            alert("Booking successful! You can view it in 'My Bookings'.");
            setSelectedHall(null);
            setBookingDates('');
        }
        catch (e) {
            alert("Booking failed. Please try again.");
        }
        finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="hall-search-page">
            <div className="hero-section card glass-card" style={{ marginBottom: '32px', padding: '40px', background: 'linear-gradient(135deg, var(--primary) 0%, #2980b9 100%)', color: 'white' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Find the Perfect Hall for your Vibe</h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '24px' }}>Luxury venues for weddings, conferences, and celebrations.</p>
                <div style={{ display: 'flex', gap: '12px', background: 'white', padding: '8px', borderRadius: '12px' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 12px', borderRight: '1px solid #ddd' }}>
                        <Search size={20} color="#666" />
                        <input style={{ border: 'none', width: '100%', padding: '12px', fontSize: '1rem', color: '#000' }} placeholder="Search by hall name or number..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <select style={{ border: 'none', padding: '12px', fontSize: '1rem', width: '150px' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
                        <option>All Types</option>
                        <option>Standard</option>
                        <option>Deluxe</option>
                        <option>Suite</option>
                    </select>
                    <button className="btn" style={{ padding: '0 32px' }}>Explore</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {filteredHalls.map(hall => (
                    <div key={hall.id} className="card glass-card hall-card" style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.3s ease' }}>
                        <div style={{ height: '200px', background: '#ddd', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                <span className={`status-badge ${hall.status.toLowerCase()}`}>{hall.status}</span>
                            </div>
                            <img src={`https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800`} alt={hall.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                <h3 style={{ fontSize: '1.4rem' }}>{hall.name}</h3>
                                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>₹{hall.price.toLocaleString()}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                                <MapPin size={14} /> Room {hall.hallNo} • {hall.type}
                            </p>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '0.9rem', color: '#555' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Users size={16} /> Up to {hall.capacity}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Wifi size={16} /> Free Wifi
                                </span>
                            </div>
                            <button className="btn" style={{ width: '100%' }} onClick={() => setSelectedHall(hall)} disabled={hall.status !== 'Available'}>
                                {hall.status === 'Available' ? 'Book Now' : 'Not Available'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedHall && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card" style={{ maxWidth: '450px' }}>
                        <div className="modal-header">
                            <h2>Confirm Booking: {selectedHall.name}</h2>
                            <button className="btn-icon" onClick={() => setSelectedHall(null)} style={{ fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Check-in/out Dates</p>
                            <input type="text" placeholder="e.g. Oct 20 - Oct 22" required style={{ marginTop: '8px' }} value={bookingDates} onChange={e => setBookingDates(e.target.value)} />
                        </div>
                        <div className="card" style={{ backgroundColor: '#f8f9fa', border: 'none', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Hall Charge</span>
                                <span>₹{selectedHall.price.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #ddd', marginBottom: '8px' }}>
                                <span>Service Fee</span>
                                <span>₹500</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                                <span>Total Amount</span>
                                <span>₹{(selectedHall.price + 500).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setSelectedHall(null)}>Cancel</button>
                            <button className="btn" onClick={handleBookNow} disabled={isBooking || !bookingDates} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {isBooking ? 'Processing...' : (
                                    <>
                                        <CheckCircle size={18} /> Confirm Reservation
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
