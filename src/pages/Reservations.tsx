import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Reservation } from '../context/AuthContext';

export default function Reservations() {
  const { reservations, setReservations, rooms, isReceptionist } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const [formData, setFormData] = useState({
    guestName: '',
    dates: '',
    roomId: '',
    status: 'Confirmed',
    amount: 0,
    paymentStatus: 'Pending'
  });

  const handleOpenModal = (res?: Reservation) => {
    if (res) {
      setEditingReservation(res);
      setFormData({ 
        guestName: res.guestName, 
        dates: res.dates, 
        roomId: res.roomId, 
        status: res.status,
        amount: res.amount,
        paymentStatus: res.paymentStatus
      });
    } else {
      setEditingReservation(null);
      setFormData({ 
        guestName: '', 
        dates: '', 
        roomId: rooms.length > 0 ? rooms[0].id : '', 
        status: 'Confirmed', 
        amount: 0, 
        paymentStatus: 'Pending' 
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = `http://${window.location.hostname}:5001`;
    try {
      if (editingReservation) {
        const res = await fetch(`${baseUrl}/reservations/${editingReservation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editingReservation, ...formData })
        });
        const updatedRes = await res.json();
        setReservations(reservations.map(r => r.id === editingReservation.id ? updatedRes : r));
      } else {
        const newResData = {
          id: 'RES-' + Math.floor(Math.random() * 10000),
          userId: 'KVCBE2lUifA', // Default to a guest for manual admin adds
          ...formData
        };
        const res = await fetch(`${baseUrl}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newResData)
        });
        const savedRes = await res.json();
        setReservations([...reservations, savedRes]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to save booking. Check server.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const baseUrl = `http://${window.location.hostname}:5001`;
      try {
        await fetch(`${baseUrl}/reservations/${id}`, { method: 'DELETE' });
        setReservations(reservations.filter(r => r.id !== id));
      } catch (error) {
        alert("Failed to cancel booking.");
      }
    }
  };

  const handleStatusChange = async (res: Reservation, newStatus: string) => {
    const baseUrl = `http://${window.location.hostname}:5001`;
    try {
      const resp = await fetch(`${baseUrl}/reservations/${res.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (resp.ok) {
        const updated = await resp.json();
        setReservations(reservations.map(r => r.id === res.id ? updated : r));
      }
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  const handleGenerateInvoice = (res: Reservation) => {
    alert(`Generated Invoice for Booking ${res.id}\nGuest: ${res.guestName}\nTotal: ₹${res.amount}\nStatus: ${res.paymentStatus}`);
  };

  const getRoomInfo = (roomId: string) => {
    const r = rooms.find(room => room.id === roomId);
    return r ? `${r.name} (${r.roomNo})` : 'Unknown Room';
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Room Bookings Management</h1>
        <button className="btn" onClick={() => handleOpenModal()}>New Booking</button>
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest Name</th>
              <th>Dates</th>
              <th>Room</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{res.guestName}</td>
                <td>{res.dates}</td>
                <td>{getRoomInfo(res.roomId)}</td>
                <td>₹{res.amount?.toLocaleString() || 0}</td>
                <td>
                  <span className={`status-badge ${res.status.toLowerCase().replace(' ', '-')}`}>
                    {res.status}
                  </span>
                </td>
                <td>
                  <span style={{ color: res.paymentStatus === 'Paid' ? '#28a745' : '#dc3545', fontWeight: 600 }}>
                    {res.paymentStatus}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleOpenModal(res)}>Manage</button>
                  
                  {res.status === 'Confirmed' && (
                    <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', borderColor: '#10b981', color: '#10b981' }} onClick={() => handleStatusChange(res, 'Checked In')}>Check In</button>
                  )}
                  {res.status === 'Checked In' && (
                    <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', borderColor: '#f59e0b', color: '#f59e0b' }} onClick={() => handleStatusChange(res, 'Checked Out')}>Check Out</button>
                  )}
                  
                  <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleGenerateInvoice(res)}>Invoice</button>
                  
                  {!isReceptionist && <button className="btn-secondary btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleDelete(res.id)}>Cancel</button>}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '24px' }}>No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <h2>{editingReservation ? 'Manage Booking' : 'New Booking'}</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)} style={{ fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Guest Name</label>
                <input required value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} placeholder="Full Name"/>
              </div>
              <div className="form-group">
                <label>Dates</label>
                <input required value={formData.dates} onChange={e => setFormData({...formData, dates: e.target.value})} placeholder="e.g. Oct 14 - Oct 16" />
              </div>
              <div className="form-group">
                <label>Room</label>
                <select value={formData.roomId} onChange={e => {
                  const room = rooms.find(r => r.id === e.target.value);
                  setFormData({...formData, roomId: e.target.value, amount: room ? room.price : 0});
                }}>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.roomNo}) - ₹{r.price.toLocaleString()}</option>
                  ))}
                  {rooms.length === 0 && <option value="">No rooms available</option>}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Booking Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option>Confirmed</option>
                    <option>Checked In</option>
                    <option>Checked Out</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Refunded</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                <button type="submit" className="btn" disabled={rooms.length === 0}>Save Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

