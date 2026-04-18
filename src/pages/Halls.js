import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
export default function Halls() {
    const { halls, setHalls } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHall, setEditingHall] = useState(null);
    const [formData, setFormData] = useState({
        hallNo: '',
        name: '',
        type: 'Standard',
        status: 'Available',
        price: '',
        capacity: ''
    });
    const handleOpenModal = (hall) => {
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
    const handleSave = async (e) => {
        e.preventDefault();
        const hallData = {
            ...formData,
            price: Number(formData.price),
            capacity: Number(formData.capacity),
            amenities: editingHall?.amenities || ["Wifi", "AC"]
        };
        const baseUrl = 'http://localhost:5001';
        try {
            if (editingHall) {
                const res = await fetch(`${baseUrl}/halls/${editingHall.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(hallData)
                });
                const updatedHall = await res.json();
                setHalls(halls.map(h => h.id === editingHall.id ? updatedHall : h));
            }
            else {
                const res = await fetch(`${baseUrl}/halls`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(hallData)
                });
                const newHall = await res.json();
                setHalls([...halls, newHall]);
            }
            setIsModalOpen(false);
        }
        catch (error) {
            alert("Failed to save hall. Check server.");
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hall?')) {
            const baseUrl = 'http://localhost:5001';
            try {
                await fetch(`${baseUrl}/halls/${id}`, { method: 'DELETE' });
                setHalls(halls.filter(h => h.id !== id));
            }
            catch (error) {
                alert("Failed to delete hall.");
            }
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "page-header", children: [_jsx("h1", { className: "page-title", children: "Hall & Venue Management" }), _jsx("button", { className: "btn", onClick: () => handleOpenModal(), children: "Add Hall" })] }), _jsx("div", { className: "card", style: { padding: 0, overflowX: 'auto' }, children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Hall No" }), _jsx("th", { children: "Name" }), _jsx("th", { children: "Type" }), _jsx("th", { children: "Capacity" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Price/Night" }), _jsx("th", { children: "Actions" })] }) }), _jsxs("tbody", { children: [halls.map(hall => (_jsxs("tr", { children: [_jsx("td", { children: hall.hallNo }), _jsx("td", { children: hall.name }), _jsx("td", { children: hall.type }), _jsx("td", { children: hall.capacity }), _jsx("td", { children: _jsx("span", { className: `status-badge ${hall.status.toLowerCase()}`, children: hall.status }) }), _jsxs("td", { children: ["\u20B9", hall.price.toLocaleString()] }), _jsxs("td", { children: [_jsx("button", { className: "btn-secondary", style: { padding: '4px 8px', fontSize: '0.8rem', marginRight: '8px' }, onClick: () => handleOpenModal(hall), children: "Edit" }), _jsx("button", { className: "btn-secondary btn-danger", style: { padding: '4px 8px', fontSize: '0.8rem' }, onClick: () => handleDelete(hall.id), children: "Delete" })] })] }, hall.id))), halls.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 7, style: { textAlign: 'center', padding: '24px' }, children: "No halls added." }) }))] })] }) }), isModalOpen && (_jsx("div", { className: "modal-overlay", children: _jsxs("div", { className: "modal-content glass-card", style: { maxWidth: '500px' }, children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { children: editingHall ? 'Edit Hall' : 'Add New Hall' }), _jsx("button", { className: "btn-icon", onClick: () => setIsModalOpen(false), style: { fontSize: '1.5rem', lineHeight: 1 }, children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSave, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Hall No" }), _jsx("input", { required: true, value: formData.hallNo, onChange: e => setFormData({ ...formData, hallNo: e.target.value }), placeholder: "H-101" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Hall Name" }), _jsx("input", { required: true, value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }), placeholder: "Grand Ballroom" })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Type" }), _jsxs("select", { value: formData.type, onChange: e => setFormData({ ...formData, type: e.target.value }), children: [_jsx("option", { children: "Standard" }), _jsx("option", { children: "Deluxe" }), _jsx("option", { children: "Suite" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Status" }), _jsxs("select", { value: formData.status, onChange: e => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { children: "Available" }), _jsx("option", { children: "Occupied" }), _jsx("option", { children: "Maintenance" })] })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Capacity" }), _jsx("input", { required: true, type: "number", value: formData.capacity, onChange: e => setFormData({ ...formData, capacity: e.target.value }), placeholder: "500" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Price/Night (\u20B9)" }), _jsx("input", { required: true, type: "number", value: formData.price, onChange: e => setFormData({ ...formData, price: e.target.value }), placeholder: "20000" })] })] }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { type: "button", className: "btn-secondary", onClick: () => setIsModalOpen(false), children: "Cancel" }), _jsx("button", { type: "submit", className: "btn", children: "Save Hall" })] })] })] }) }))] }));
}
