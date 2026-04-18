import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/login-bg.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loginType, setLoginType] = useState<'guest' | 'admin' | 'receptionist'>('guest');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Guest Login
    if (loginType === 'guest') {
      if (!guestName.trim()) {
        alert("Please enter your name");
        return;
      }

      login({
        id: `guest-${Date.now()}`,
        name: guestName.trim(),
        email: 'guest@vibestays.com',
        role: 'guest',
        phone: 'N/A'
      });

      navigate('/');
      return;
    }

    // ✅ Fake Admin / Receptionist Login (Frontend Only)
    setIsLoading(true);

    setTimeout(() => {
      login({
        id: "1",
        name: loginType === 'admin' ? "Admin User" : "Receptionist User",
        email: email || `${loginType}@demo.com`,
        role: loginType,
        phone: "1234567890"
      });

      navigate('/');
      setIsLoading(false);
    }, 1000); // simulate loading
  };

  return (
    <div className="auth-page-wrapper" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="auth-content">
        <div className="glass-form" style={{ padding: '48px', borderRadius: '28px' }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800 }}>Vibe Stays</h1>
            <p>Luxury redefined. Experience excellence.</p>
          </div>

          {/* Login Type Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {['guest', 'receptionist', 'admin'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setLoginType(type as any)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: loginType === type ? '#2563eb' : '#eee',
                  color: loginType === type ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '10px'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Guest */}
            {loginType === 'guest' ? (
              <input
                type="text"
                placeholder="Enter your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : loginType === 'guest'
                ? "Continue as Guest"
                : `Login as ${loginType}`}
            </button>
          </form>

          {/* Signup */}
          {loginType === 'guest' && (
            <Link to="/signup" style={{ display: 'block', marginTop: '20px' }}>
              Create Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}