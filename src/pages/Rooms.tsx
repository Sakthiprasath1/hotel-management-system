import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Room } from '../context/AuthContext';

export default function Rooms() {
  const { rooms, setRooms } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [formData, setFormData] = useState({
    roomNo: '',
    name: '',
    type: 'Standard',
    status: 'Available',
    price: '',
    capacity: ''
  });

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({ 
        roomNo: room.roomNo, 
        name: room.name,
        type: room.type, 
        status: room.status, 
        price: room.price.toString(),
        capacity: room.capacity.toString()
      });
    } else {
      setEditingRoom(null);
      setFormData({ roomNo: '', name: '', type: 'Standard', status: 'Available', price: '', capacity: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const roomData = { 
      ...formData, 
      price: Number(formData.price), 
      capacity: Number(formData.capacity),
      amenities: editingRoom?.amenities || ["Wifi", "AC"],
      image: editingRoom?.image || "/assets/rooms/room_standard.png"
    };
    
    const baseUrl = `http://${window.location.hostname}:5001`;
    try {
      if (editingRoom) {
        const res = await fetch(`${baseUrl}/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomData)
        });
        const updatedRoom = await res.json();
        setRooms(rooms.map(r => r.id === editingRoom.id ? updatedRoom : r));
      } else {
        const res = await fetch(`${baseUrl}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomData)
        });
        const newRoom = await res.json();
        setRooms([...rooms, newRoom]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to save room. Check server.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      const baseUrl = `http://${window.location.hostname}:5001`;
      try {
        await fetch(`${baseUrl}/rooms/${id}`, { method: 'DELETE' });
        setRooms(rooms.filter(r => r.id !== id));
      } catch (error) {
        alert("Failed to delete room.");
      }
    }
  };

  return (
    <div className="rooms-management-page">
      <div className="page-header">
        <h1 className="page-title">Room Management</h1>
        <button className="premium-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => handleOpenModal()}>+ Add Room</button>
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ textAlign: 'left', padding: '16px 24px' }}>Room No</th>
              <th style={{ textAlign: 'left', padding: '16px 24px' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '16px 24px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '16px 24px' }}>Capacity</th>
              <th style={{ textAlign: 'left', padding: '16px 24px' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '16px 24px' }}>Price/Night</th>
              <th style={{ textAlign: 'left', padding: '16px 24px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 600 }}>{room.roomNo}</td>
                <td style={{ padding: '16px 24px' }}>{room.name}</td>
                <td style={{ padding: '16px 24px' }}>{room.type}</td>
                <td style={{ padding: '16px 24px' }}>{room.capacity} Guests</td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={`status-badge ${room.status.toLowerCase()}`} style={{ 
                    padding: '4px 10px', 
                    borderRadius: '100px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    background: room.status === 'Available' ? 'var(--success)' : (room.status === 'Occupied' ? '#64748b' : '#ef4444'),
                    color: 'white'
                  }}>
                    {room.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 700 }}>₹{room.price.toLocaleString()}</td>
                <td style={{ padding: '16px 24px' }}>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: '8px', borderRadius: '8px' }} onClick={() => handleOpenModal(room)}>Edit</button>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px' }} onClick={() => handleDelete(room.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No rooms found in the catalog.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)} style={{ fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Room No</label>
                  <input required value={formData.roomNo} onChange={e => setFormData({...formData, roomNo: e.target.value})} placeholder="R-101" />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Room Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Deluxe Ocean Suite" />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '10px' }}>
                    <option>Standard</option>
                    <option>Deluxe</option>
                    <option>Executive</option>
                    <option>Royal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '10px' }}>
                    <option>Available</option>
                    <option>Occupied</option>
                    <option>Maintenance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Max Guests</label>
                  <input required type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} placeholder="2" />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Price/Night (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="5000" />
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '32px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="premium-btn" style={{ width: 'auto', padding: '10px 32px' }}>Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

