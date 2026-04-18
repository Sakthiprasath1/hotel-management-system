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
  const { login, isAuthenticated, user, users: allUsers } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Guest Login Flow (No email/password check)
    if (loginType === 'guest') {
      if (!guestName.trim()) {
        alert("Please enter a name to continue as a guest.");
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

    // Admin / Receptionist Auth Flow
    setIsLoading(true);
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      // Use local users list instead of fetch
      const foundUser = allUsers.find((u: any) => u.email === trimmedEmail && u.password === trimmedPassword);

      if (foundUser) {
        if (foundUser.role.toLowerCase() !== loginType) {
          alert(`Access denied. Please use the ${foundUser.role} tab to login.`);
          setIsLoading(false);
          return;
        }
        login(foundUser);
        navigate('/');
      } else {
        alert("Invalid email or password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="auth-content">
        <div className="glass-form" style={{ padding: '48px', borderRadius: '28px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '2.8rem', 
              fontWeight: 800, 
              color: 'var(--primary)', 
              marginBottom: '4px',
              letterSpacing: '-1.5px',
              fontFamily: 'Outfit, sans-serif'
            }}>
              Vibe Stays
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 400 }}>
              Luxury redefined. Experience excellence.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'rgba(255,255,255,0.5)', padding: '6px', borderRadius: '16px' }}>
            {['guest', 'receptionist', 'admin'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setLoginType(type as any)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  border: 'none',
                  background: loginType === type ? 'var(--primary)' : 'transparent',
                  color: loginType === type ? 'white' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: loginType === type ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {loginType === 'guest' ? (
              <div className="form-group" style={{ marginBottom: '36px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>Your Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe" 
                  value={guestName} 
                  onChange={e => setGuestName(e.target.value)} 
                  style={{ 
                    padding: '14px 18px', 
                    borderRadius: '12px', 
                    fontSize: '1rem',
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'rgba(255,255,255,0.7)'
                  }}
                />
              </div>
            ) : (
              <>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    style={{ 
                      padding: '14px 18px', 
                      borderRadius: '12px', 
                      fontSize: '1rem',
                      border: '1px solid rgba(0,0,0,0.05)',
                      background: 'rgba(255,255,255,0.7)'
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '36px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>Password</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    style={{ 
                      padding: '14px 18px', 
                      borderRadius: '12px', 
                      fontSize: '1rem',
                      border: '1px solid rgba(0,0,0,0.05)',
                      background: 'rgba(255,255,255,0.7)'
                    }}
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="premium-btn" 
              disabled={isLoading}
              style={{ padding: '16px' }}
            >
              {isLoading ? 'Verifying...' : (loginType === 'guest' ? 'Continue as Guest' : `Sign In as ${loginType.charAt(0).toUpperCase() + loginType.slice(1)}`)}
            </button>
          </form>

          {loginType === 'guest' && (
            <>
              <div style={{ position: 'relative', textAlign: 'center', margin: '32px 0' }}>
                <span style={{ background: '#f1f5f9', padding: '0 16px', color: 'var(--text-muted)', fontSize: '0.85rem', position: 'relative', zIndex: 1, borderRadius: '10px' }}>OR</span>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--border-color)', zIndex: 0 }}></div>
              </div>
              
              <Link to="/signup" style={{ 
                display: 'block', 
                textAlign: 'center', 
                padding: '16px', 
                border: '1px solid var(--primary)', 
                color: 'var(--primary)', 
                borderRadius: '12px', 
                fontWeight: 700, 
                textDecoration: 'none',
                background: 'rgba(37, 99, 235, 0.05)'
              }}>
                Create Full Account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

