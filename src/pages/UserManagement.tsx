import { useState } from 'react';
import { useAuth, User } from '../context/AuthContext';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users on mount
  useState(() => {
    const fetchUsers = async () => {
      try {
        const baseUrl = `http://${window.location.hostname}:5001`;
        const res = await fetch(`${baseUrl}/users`);
        setUsers(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  });

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'guest') => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    try {
      const baseUrl = `http://${window.location.hostname}:5001`;
      const res = await fetch(`${baseUrl}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (e) {
      alert("Failed to update user role.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Account Management</h1>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading users...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    {u.id === currentUser?.id && <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>(You)</span>}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    <span className={`status-badge ${u.role === 'admin' ? 'occupied' : 'available'}`} style={{ textTransform: 'capitalize' }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.id !== currentUser?.id && (
                      <select 
                        value={u.role} 
                        onChange={(e) => handleUpdateRole(u.id, e.target.value as any)}
                        style={{ padding: '4px', width: 'auto', fontSize: '0.8rem' }}
                      >
                        <option value="guest">Make Guest</option>
                        <option value="admin">Make Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
