import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
export default function Staff() {
    const { staff, setStaff } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: 'Receptionist',
        shift: 'Morning',
        status: 'Active'
    });
    const handleOpenModal = (s) => {
        if (s) {
            setEditingStaff(s);
            setFormData({ name: s.name, role: s.role, shift: s.shift, status: s.status });
        }
        else {
            setEditingStaff(null);
            setFormData({ name: '', role: 'Receptionist', shift: 'Morning', status: 'Active' });
        }
        setIsModalOpen(true);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        const baseUrl = 'http://localhost:5001';
        try {
            if (editingStaff) {
                const res = await fetch(`${baseUrl}/staff/${editingStaff.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const updatedStaff = await res.json();
                setStaff(staff.map(s => s.id === editingStaff.id ? updatedStaff : s));
            }
            else {
                const res = await fetch(`${baseUrl}/staff`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const newStaff = await res.json();
                setStaff([...staff, newStaff]);
            }
            setIsModalOpen(false);
        }
        catch (error) {
            alert("Failed to save staff member. Check server.");
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this staff member?')) {
            const baseUrl = 'http://localhost:5001';
            try {
                await fetch(`${baseUrl}/staff/${id}`, { method: 'DELETE' });
                setStaff(staff.filter(s => s.id !== id));
            }
            catch (error) {
                alert("Failed to remove staff member.");
            }
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "page-header", children: [_jsx("h1", { className: "page-title", children: "Staff Management" }), _jsx("button", { className: "btn", onClick: () => handleOpenModal(), children: "Add Staff" })] }), _jsx("div", { className: "card glass-card", style: { padding: 0, overflowX: 'auto' }, children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Role" }), _jsx("th", { children: "Shift" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Actions" })] }) }), _jsxs("tbody", { children: [staff.map(s => (_jsxs("tr", { children: [_jsx("td", { style: { fontWeight: 600 }, children: s.name }), _jsx("td", { children: s.role }), _jsx("td", { children: s.shift }), _jsx("td", { children: _jsx("span", { className: `status-badge ${s.status === 'Active' ? 'available' : 'occupied'}`, children: s.status }) }), _jsxs("td", { children: [_jsx("button", { className: "btn-secondary", style: { padding: '4px 8px', fontSize: '0.8rem', marginRight: '8px' }, onClick: () => handleOpenModal(s), children: "Edit" }), _jsx("button", { className: "btn-secondary btn-danger", style: { padding: '4px 8px', fontSize: '0.8rem' }, onClick: () => handleDelete(s.id), children: "Delete" })] })] }, s.id))), staff.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, style: { textAlign: 'center', padding: '24px' }, children: "No staff members added." }) }))] })] }) }), isModalOpen && (_jsx("div", { className: "modal-overlay", children: _jsxs("div", { className: "modal-content glass-card", children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { children: editingStaff ? 'Edit Staff' : 'Add Staff Member' }), _jsx("button", { className: "btn-icon", onClick: () => setIsModalOpen(false), style: { fontSize: '1.5rem', lineHeight: 1 }, children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSave, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Name" }), _jsx("input", { required: true, value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }), placeholder: "Full Name" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Role" }), _jsxs("select", { value: formData.role, onChange: e => setFormData({ ...formData, role: e.target.value }), children: [_jsx("option", { children: "Receptionist" }), _jsx("option", { children: "Housekeeping" }), _jsx("option", { children: "Manager" }), _jsx("option", { children: "Security" }), _jsx("option", { children: "Maintenance" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Shift" }), _jsxs("select", { value: formData.shift, onChange: e => setFormData({ ...formData, shift: e.target.value }), children: [_jsx("option", { children: "Morning" }), _jsx("option", { children: "Evening" }), _jsx("option", { children: "Night" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Status" }), _jsxs("select", { value: formData.status, onChange: e => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { children: "Active" }), _jsx("option", { children: "On Leave" }), _jsx("option", { children: "Inactive" })] })] }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { type: "button", className: "btn-secondary", onClick: () => setIsModalOpen(false), children: "Cancel" }), _jsx("button", { type: "submit", className: "btn", children: "Save Member" })] })] })] }) }))] }));
}
