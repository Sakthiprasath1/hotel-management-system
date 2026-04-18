import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Room } from '../context/AuthContext';
import { Search, MapPin, Users, Wifi } from 'lucide-react';

export default function RoomSearch() {
  const { rooms } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const navigate = useNavigate();

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          room.roomNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || room.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleBookNow = (room: Room) => {
    navigate('/payment', { state: { room } });
  };

  return (
    <div className="room-search-page">
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h2 className="page-title">Find Your Perfect Stay</h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="search-box" style={{ 
            background: 'white', 
            padding: '8px 20px', 
            borderRadius: '100px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            border: '1px solid var(--border-color)',
            width: '350px'
          }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by name or number..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'none', padding: 0, fontSize: '0.95rem', width: '100%', color: '#000' }}
            />
          </div>
          <select 
            className="btn-secondary" 
            style={{ borderRadius: '100px', padding: '10px 24px', cursor: 'pointer' }}
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Executive">Executive</option>
            <option value="Royal">Royal</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
        {filteredRooms.map(room => (
          <div key={room.id} className="card room-card" style={{ padding: 0, overflow: 'hidden', transition: 'all 0.3s ease', border: '1px solid var(--border-color)', background: 'white' }}>
            <div style={{ height: '220px', background: '#f1f5f9', position: 'relative' }}>
               <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                 <span className={`status-badge ${room.status.toLowerCase()}`} style={{ 
                   padding: '6px 12px', 
                   borderRadius: '100px', 
                   fontSize: '0.75rem', 
                   fontWeight: 700,
                   textTransform: 'uppercase',
                   background: room.status === 'Available' ? 'var(--success)' : '#64748b',
                   color: 'white'
                 }}>
                   {room.status}
                 </span>
               </div>
               <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '24px', color: '#000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000' }}>{room.name}</h3>
                <span style={{ fontWeight: 800, color: '#000', fontSize: '1.2rem' }}>₹{room.price.toLocaleString()}</span>
              </div>
              <p style={{ color: '#333', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>
                <MapPin size={14} /> Room {room.roomNo} • {room.type}
              </p>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', fontSize: '0.85rem', color: '#111' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={16} /> Max {room.capacity} Guests</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Wifi size={16} /> Free High-Speed Wifi</span>
              </div>

              <button 
                className="premium-btn" 
                style={{ width: '100%', padding: '12px' }}
                onClick={() => handleBookNow(room)}
                disabled={room.status !== 'Available'}
              >
                {room.status === 'Available' ? 'Book Room' : 'Sold Out'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
