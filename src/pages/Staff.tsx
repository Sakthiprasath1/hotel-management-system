import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Staff as StaffType } from '../context/AuthContext';

export default function Staff() {
  const { staff, setStaff } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffType | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Receptionist',
    shift: 'Morning',
    status: 'Active'
  });

  const handleOpenModal = (s?: StaffType) => {
    if (s) {
      setEditingStaff(s);
      setFormData({ name: s.name, role: s.role, shift: s.shift, status: s.status });
    } else {
      setEditingStaff(null);
      setFormData({ name: '', role: 'Receptionist', shift: 'Morning', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = `http://${window.location.hostname}:5001`;
    try {
      if (editingStaff) {
        const res = await fetch(`${baseUrl}/staff/${editingStaff.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const updatedStaff = await res.json();
        setStaff(staff.map(s => s.id === editingStaff.id ? updatedStaff : s));
      } else {
        const res = await fetch(`${baseUrl}/staff`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const newStaff = await res.json();
        setStaff([...staff, newStaff]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to save staff member. Check server.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      const baseUrl = `http://${window.location.hostname}:5001`;
      try {
        await fetch(`${baseUrl}/staff/${id}`, { method: 'DELETE' });
        setStaff(staff.filter(s => s.id !== id));
      } catch (error) {
        alert("Failed to remove staff member.");
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Staff Management</h1>
        <button className="btn" onClick={() => handleOpenModal()}>Add Staff</button>
      </div>
      <div className="card glass-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td>{s.role}</td>
                <td>{s.shift}</td>
                <td>
                  <span className={`status-badge ${s.status === 'Active' ? 'available' : 'occupied'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', marginRight: '8px' }} onClick={() => handleOpenModal(s)}>Edit</button>
                  <button className="btn-secondary btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>No staff members added.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <h2>{editingStaff ? 'Edit Staff' : 'Add Staff Member'}</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)} style={{ fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option>Receptionist</option>
                  <option>Housekeeping</option>
                  <option>Manager</option>
                  <option>Security</option>
                  <option>Maintenance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Shift</label>
                <select value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}>
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

