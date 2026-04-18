import { useAuth } from '../context/AuthContext';

export default function Reports() {
  const { rooms, payments, reservations } = useAuth();
  
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const avgOccupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const pendingRevenue = reservations.filter(r => r.paymentStatus === 'Pending').reduce((acc, r) => acc + r.amount, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics & Room Reports</h1>
        <button className="btn-secondary">Export PDF Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="card glass-card">
          <h3>Utilization Metrics</h3>
          <div style={{ marginTop: '24px' }}>
            <div className="form-group">
              <label>Room Occupancy</label>
              <div style={{ height: '20px', backgroundColor: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${avgOccupancy}%`, backgroundColor: 'var(--primary)' }}></div>
              </div>
              <p style={{ marginTop: '8px', fontWeight: 600 }}>{avgOccupancy}% across {totalRooms} rooms</p>
            </div>
            
            <div style={{ marginTop: '32px' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Realized Revenue</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 700 }}>₹{totalRevenue.toLocaleString()}</p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pending Payments</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#dc3545' }}>₹{pendingRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card glass-card">
          <h3>Venue Performance Breakdown</h3>
          <div style={{ marginTop: '16px' }}>
            <table>
              <thead>
                <tr>
                  <th>Room Name</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => {
                  const roomBookings = reservations.filter(r => r.roomId === room.id);
                  const roomRevenue = roomBookings.reduce((acc, r) => acc + (r.paymentStatus === 'Paid' ? r.amount : 0), 0);
                  const bookingCount = roomBookings.length;
                  
                  return (
                    <tr key={room.id}>
                      <td>{room.name}</td>
                      <td>{bookingCount}</td>
                      <td>₹{roomRevenue.toLocaleString()}</td>
                      <td>
                        <span style={{ color: room.status === 'Occupied' ? 'var(--primary)' : 'inherit' }}>
                          {room.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

