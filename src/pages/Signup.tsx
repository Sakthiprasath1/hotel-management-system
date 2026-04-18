import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/login-bg.jpg';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = `http://${window.location.hostname}:5001`;
      const checkRes = await fetch(`${baseUrl}/users?email=${encodeURIComponent(trimmedEmail)}`);
      const existingData = await checkRes.json();

      if (existingData.length > 0) {
        alert("Account with this email already exists!");
        setIsLoading(false);
        return;
      }

      const newUser = { 
        name, 
        email: trimmedEmail, 
        password: trimmedPassword, 
        role: 'guest', 
        phone 
      };

      const res = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        const createdUser = await res.json();
        login(createdUser);
        navigate('/');
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Registration failed. Make sure the server is running on port 5001.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    login({
      id: `guest-${Date.now()}`,
      name: 'Guest User',
      email: 'guest@vibestays.com',
      role: 'guest',
      phone: 'N/A'
    });
    navigate('/');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-content">
        <div className="glass-form" style={{ maxWidth: '500px', padding: '48px', borderRadius: '28px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '2.8rem', 
              fontWeight: 800, 
              color: 'var(--primary)', 
              marginBottom: '4px',
              fontFamily: 'Outfit, sans-serif'
            }}>
              Join Vibe
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your journey into excellence starts here.</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Full Name</label>
                <input required placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Phone</label>
                <input required placeholder="98765..." value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Email</label>
              <input type="email" required placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Password</label>
                <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Confirm</label>
                <input type="password" required placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="premium-btn" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>

            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleGuestLogin}
              style={{ padding: '16px', width: '100%', marginTop: '16px', borderRadius: '12px', textAlign: 'center', justifyContent: 'center' }}
            >
              Continue as Guest
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '36px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Login now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

