import { useState } from 'react';
import { useAuth, Hall } from '../context/AuthContext';

export default function Halls() {
    const { halls, setHalls } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHall, setEditingHall] = useState<Hall | null>(null);
    const [formData, setFormData] = useState({
        hallNo: '',
        name: '',
        type: 'Standard',
        status: 'Available',
        price: '',
        capacity: ''
    });

    const handleOpenModal = (hall?: Hall) => {
        if (hall) {
            setEditingHall(hall);
            setFormData({
                hallNo: hall.hallNo,
                name: hall.name,
                type: hall.type,
                status: hall.status,
                price: hall.price.toString(),
                capacity: hall.capacity.toString()
            });
        }
        else {
            setEditingHall(null);
            setFormData({ hallNo: '', name: '', type: 'Standard', status: 'Available', price: '', capacity: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const hallData = {
            ...formData,
            price: Number(formData.price),
            capacity: Number(formData.capacity),
            amenities: editingHall?.amenities || ["Wifi", "AC"]
        };
        try {
            if (editingHall) {
                const updatedHall = { ...hallData, id: editingHall.id } as Hall;
                setHalls(halls.map(h => h.id === editingHall.id ? updatedHall : h));
            }
            else {
                const newHall = { ...hallData, id: Math.random().toString(36).substr(2, 9) } as Hall;
                setHalls([...halls, newHall]);
            }
            setIsModalOpen(false);
        }
        catch (error) {
            alert("Failed to save hall.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this hall?')) {
            try {
                setHalls(halls.filter(h => h.id !== id));
            }
            catch (error) {
                alert("Failed to delete hall.");
            }
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Hall & Venue Management</h1>
                <button className="btn" onClick={() => handleOpenModal()}>Add Hall</button>
            </div>
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Hall No</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Price/Night</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {halls.map(hall => (
                            <tr key={hall.id}>
                                <td>{hall.hallNo}</td>
                                <td>{hall.name}</td>
                                <td>{hall.type}</td>
                                <td>{hall.capacity}</td>
                                <td><span className={`status-badge ${hall.status.toLowerCase()}`}>{hall.status}</span></td>
                                <td>₹{hall.price.toLocaleString()}</td>
                                <td>
                                    <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', marginRight: '8px' }} onClick={() => handleOpenModal(hall)}>Edit</button>
                                    <button className="btn-secondary btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleDelete(hall.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {halls.length === 0 && (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>No halls added.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>{editingHall ? 'Edit Hall' : 'Add New Hall'}</h2>
                            <button className="btn-icon" onClick={() => setIsModalOpen(false)} style={{ fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>Hall No</label>
                                    <input required value={formData.hallNo} onChange={e => setFormData({ ...formData, hallNo: e.target.value })} placeholder="H-101" />
                                </div>
                                <div className="form-group">
                                    <label>Hall Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Grand Ballroom" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option>Standard</option>
                                        <option>Deluxe</option>
                                        <option>Suite</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                        <option>Available</option>
                                        <option>Occupied</option>
                                        <option>Maintenance</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>Capacity</label>
                                    <input required type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} placeholder="500" />
                                </div>
                                <div className="form-group">
                                    <label>Price/Night (₹)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="20000" />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn">Save Hall</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
