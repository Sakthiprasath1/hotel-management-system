import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
export default function UserManagement() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Fetch users on mount
    useState(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:5001/users');
                setUsers(await res.json());
            }
            catch (e) {
                console.error(e);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    });
    const handleUpdateRole = async (userId, newRole) => {
        const userToUpdate = users.find(u => u.id === userId);
        if (!userToUpdate)
            return;
        try {
            const res = await fetch(`http://localhost:5001/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            }
        }
        catch (e) {
            alert("Failed to update user role.");
        }
    };
    return (_jsxs("div", { children: [_jsx("div", { className: "page-header", children: _jsx("h1", { className: "page-title", children: "User Account Management" }) }), _jsx("div", { className: "card", style: { padding: 0 }, children: isLoading ? (_jsx("div", { style: { padding: '40px', textAlign: 'center' }, children: "Loading users..." })) : (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Phone" }), _jsx("th", { children: "Role" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: users.map(u => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("div", { style: { fontWeight: 600 }, children: u.name }), u.id === currentUser?.id && _jsx("span", { style: { fontSize: '0.7rem', color: 'var(--primary)' }, children: "(You)" })] }), _jsx("td", { children: u.email }), _jsx("td", { children: u.phone }), _jsx("td", { children: _jsx("span", { className: `status-badge ${u.role === 'admin' ? 'occupied' : 'available'}`, style: { textTransform: 'capitalize' }, children: u.role }) }), _jsx("td", { children: u.id !== currentUser?.id && (_jsxs("select", { value: u.role, onChange: (e) => handleUpdateRole(u.id, e.target.value), style: { padding: '4px', width: 'auto', fontSize: '0.8rem' }, children: [_jsx("option", { value: "guest", children: "Make Guest" }), _jsx("option", { value: "admin", children: "Make Admin" })] })) })] }, u.id))) })] })) })] }));
}
