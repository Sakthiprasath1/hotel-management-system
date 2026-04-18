import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
export default function Reservations() {
    const { reservations, setReservations, halls } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [formData, setFormData] = useState({
        guestName: '',
        dates: '',
        hallId: '',
        status: 'Confirmed',
        amount: 0,
        paymentStatus: 'Pending'
    });
    const handleOpenModal = (res) => {
        if (res) {
            setEditingReservation(res);
            setFormData({
                guestName: res.guestName,
                dates: res.dates,
                hallId: res.hallId,
                status: res.status,
                amount: res.amount,
                paymentStatus: res.paymentStatus
            });
        }
        else {
            setEditingReservation(null);
            setFormData({
                guestName: '',
                dates: '',
                hallId: halls.length > 0 ? halls[0].id : '',
                status: 'Confirmed',
                amount: 0,
                paymentStatus: 'Pending'
            });
        }
        setIsModalOpen(true);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        const baseUrl = 'http://localhost:5001';
        try {
            if (editingReservation) {
                const res = await fetch(`${baseUrl}/reservations/${editingReservation.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...editingReservation, ...formData })
                });
                const updatedRes = await res.json();
                setReservations(reservations.map(r => r.id === editingReservation.id ? updatedRes : r));
            }
            else {
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
        }
        catch (error) {
            alert("Failed to save booking. Check server.");
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            const baseUrl = 'http://localhost:5001';
            try {
                await fetch(`${baseUrl}/reservations/${id}`, { method: 'DELETE' });
                setReservations(reservations.filter(r => r.id !== id));
            }
            catch (error) {
                alert("Failed to cancel booking.");
            }
        }
    };
    const getHallInfo = (hallId) => {
        const h = halls.find(hall => hall.id === hallId);
        return h ? `${h.name} (${h.hallNo})` : 'Unknown Hall';
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "page-header", children: [_jsx("h1", { className: "page-title", children: "Hall Booking Management" }), _jsx("button", { className: "btn", onClick: () => handleOpenModal(), children: "New Booking" })] }), _jsx("div", { className: "card", style: { padding: 0, overflowX: 'auto' }, children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Guest Name" }), _jsx("th", { children: "Dates" }), _jsx("th", { children: "Hall" }), _jsx("th", { children: "Amount" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Payment" }), _jsx("th", { children: "Actions" })] }) }), _jsxs("tbody", { children: [reservations.map(res => (_jsxs("tr", { children: [_jsx("td", { children: res.id }), _jsx("td", { children: res.guestName }), _jsx("td", { children: res.dates }), _jsx("td", { children: getHallInfo(res.hallId) }), _jsxs("td", { children: ["\u20B9", res.amount?.toLocaleString() || 0] }), _jsx("td", { children: _jsx("span", { className: `status-badge ${res.status.toLowerCase().replace(' ', '-')}`, children: res.status }) }), _jsx("td", { children: _jsx("span", { style: { color: res.paymentStatus === 'Paid' ? '#28a745' : '#dc3545', fontWeight: 600 }, children: res.paymentStatus }) }), _jsxs("td", { children: [_jsx("button", { className: "btn-secondary", style: { padding: '4px 8px', fontSize: '0.8rem', marginRight: '8px' }, onClick: () => handleOpenModal(res), children: "Manage" }), _jsx("button", { className: "btn-secondary btn-danger", style: { padding: '4px 8px', fontSize: '0.8rem' }, onClick: () => handleDelete(res.id), children: "Cancel" })] })] }, res.id))), reservations.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 8, style: { textAlign: 'center', padding: '24px' }, children: "No bookings found." }) }))] })] }) }), isModalOpen && (_jsx("div", { className: "modal-overlay", children: _jsxs("div", { className: "modal-content glass-card", children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { children: editingReservation ? 'Manage Booking' : 'New Booking' }), _jsx("button", { className: "btn-icon", onClick: () => setIsModalOpen(false), style: { fontSize: '1.5rem', lineHeight: 1 }, children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSave, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Guest Name" }), _jsx("input", { required: true, value: formData.guestName, onChange: e => setFormData({ ...formData, guestName: e.target.value }), placeholder: "Full Name" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Dates" }), _jsx("input", { required: true, value: formData.dates, onChange: e => setFormData({ ...formData, dates: e.target.value }), placeholder: "e.g. Oct 14 - Oct 16" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Hall" }), _jsxs("select", { value: formData.hallId, onChange: e => {
                                                const hall = halls.find(h => h.id === e.target.value);
                                                setFormData({ ...formData, hallId: e.target.value, amount: hall ? hall.price : 0 });
                                            }, children: [halls.map(h => (_jsxs("option", { value: h.id, children: [h.name, " (", h.hallNo, ") - \u20B9", h.price.toLocaleString()] }, h.id))), halls.length === 0 && _jsx("option", { value: "", children: "No halls available" })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Booking Status" }), _jsxs("select", { value: formData.status, onChange: e => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { children: "Confirmed" }), _jsx("option", { children: "Checked In" }), _jsx("option", { children: "Checked Out" }), _jsx("option", { children: "Pending" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Payment Status" }), _jsxs("select", { value: formData.paymentStatus, onChange: e => setFormData({ ...formData, paymentStatus: e.target.value }), children: [_jsx("option", { children: "Pending" }), _jsx("option", { children: "Paid" }), _jsx("option", { children: "Refunded" })] })] })] }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { type: "button", className: "btn-secondary", onClick: () => setIsModalOpen(false), children: "Close" }), _jsx("button", { type: "submit", className: "btn", disabled: halls.length === 0, children: "Save Booking" })] })] })] }) }))] }));
}
