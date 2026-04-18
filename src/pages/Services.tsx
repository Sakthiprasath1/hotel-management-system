import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Coffee, Droplets, CheckCircle, Clock } from 'lucide-react';

export default function Services() {
  const { user, serviceRequests, setServiceRequests } = useAuth();
  
  const [formData, setFormData] = useState({
    roomNo: '',
    type: 'Housekeeping',
  });

  const myRequests = serviceRequests.filter(req => req.userId === user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomNo) return alert("Please enter your Room Number.");

    const newReq = {
      id: 'REQ-' + Math.floor(Math.random() * 10000),
      userId: user?.id || '',
      guestName: user?.name || 'Guest',
      roomNo: formData.roomNo,
      type: formData.type,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const baseUrl = `http://${window.location.hostname}:5001`;
      const res = await fetch(`${baseUrl}/serviceRequests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
      if (res.ok) {
        const savedReq = await res.json();
        setServiceRequests([...serviceRequests, savedReq]);
        alert("Request submitted successfully!");
        setFormData({ ...formData, type: 'Housekeeping' });
      }
    } catch (err) {
      alert("Failed to submit request.");
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Housekeeping': return <Droplets size={24} color="var(--primary)" />;
      case 'Room Service': return <Coffee size={24} color="var(--primary)" />;
      default: return <Bell size={24} color="var(--primary)" />;
    }
  };

  return (
    <div className="services-page">
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="page-title">Guest Services</h1>
        <p style={{ color: 'var(--text-muted)' }}>Request housekeeping, room service, or other amenities during your stay.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Request Form */}
        <div className="card glass-card" style={{ padding: '32px', background: 'white', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', color: '#000' }}>New Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 600, marginBottom: '8px', display: 'block', color: '#000' }}>Room Number</label>
              <input 
                type="text" 
                placeholder="e.g. R-101" 
                value={formData.roomNo} 
                onChange={e => setFormData({ ...formData, roomNo: e.target.value })} 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ccc', backgroundColor: '#f9fafb', color: '#000' }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label style={{ fontWeight: 600, marginBottom: '8px', display: 'block', color: '#000' }}>Service Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div 
                  onClick={() => setFormData({ ...formData, type: 'Housekeeping' })}
                  style={{ 
                    padding: '16px', borderRadius: '16px', border: formData.type === 'Housekeeping' ? '2px solid var(--primary)' : '2px solid var(--border-color)', 
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                    background: formData.type === 'Housekeeping' ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
                  }}>
                  <Droplets size={28} color={formData.type === 'Housekeeping' ? 'var(--primary)' : '#64748b'} style={{ margin: '0 auto 8px' }} />
                  <span style={{ fontWeight: 600, color: formData.type === 'Housekeeping' ? '#000' : '#64748b' }}>Housekeeping</span>
                </div>
                <div 
                  onClick={() => setFormData({ ...formData, type: 'Room Service' })}
                  style={{ 
                    padding: '16px', borderRadius: '16px', border: formData.type === 'Room Service' ? '2px solid var(--primary)' : '2px solid var(--border-color)', 
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                    background: formData.type === 'Room Service' ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
                  }}>
                  <Coffee size={28} color={formData.type === 'Room Service' ? 'var(--primary)' : '#64748b'} style={{ margin: '0 auto 8px' }} />
                  <span style={{ fontWeight: 600, color: formData.type === 'Room Service' ? '#000' : '#64748b' }}>Room Service</span>
                </div>
              </div>
            </div>

            <button type="submit" className="premium-btn" style={{ width: '100%', padding: '14px' }}>Submit Request</button>
          </form>
        </div>

        {/* Previous Requests */}
        <div className="card glass-card" style={{ padding: '32px', background: 'white', borderRadius: '24px', color: '#000' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', color: '#000' }}>My Requests</h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {myRequests.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                 <Bell size={40} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                 <p>No active service requests.</p>
               </div>
            ) : (
               myRequests.map(req => (
                 <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', border: '1px solid #ccc' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {getIconForType(req.type)}
                     </div>
                     <div>
                       <h4 style={{ fontWeight: 700, color: '#000' }}>{req.type}</h4>
                       <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Room {req.roomNo}</p>
                     </div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <span style={{ 
                       display: 'inline-flex', alignItems: 'center', gap: '6px',
                       fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '100px',
                       background: req.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                       color: req.status === 'Completed' ? '#166534' : '#b45309'
                     }}>
                       {req.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />} {req.status}
                     </span>
                   </div>
                 </div>
               ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
