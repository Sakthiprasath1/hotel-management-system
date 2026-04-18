import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/login-bg.jpg';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        try {
            const baseUrl = 'http://localhost:5001';
            const res = await fetch(`${baseUrl}/users?email=${encodeURIComponent(trimmedEmail)}`);
            const users = await res.json();
            const foundUser = users.find((u) => u.email === trimmedEmail && u.password === trimmedPassword);
            if (foundUser) {
                login(foundUser);
                navigate('/');
            }
            else {
                alert("Invalid email or password!");
            }
        }
        catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Make sure the server is running on port 5001.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "auth-container", style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }, children: _jsxs("div", { className: "card glass-card", style: { width: '100%', maxWidth: '400px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }, children: [_jsx("h2", { style: { textAlign: 'center', marginBottom: '8px', color: 'var(--primary)', fontSize: '2rem', fontWeight: 800 }, children: "Vibe Stays" }), _jsx("p", { style: { textAlign: 'center', color: 'var(--text-muted)', marginBottom: '24px' }, children: "Welcome back" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Email Address" }), _jsx("input", { type: "email", required: true, placeholder: "name@example.com", value: email, onChange: e => setEmail(e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Password" }), _jsx("input", { type: "password", required: true, placeholder: "Your password", value: password, onChange: e => setPassword(e.target.value) })] }), _jsx("button", { type: "submit", className: "btn", disabled: isLoading, style: {
                                width: '100%',
                                marginTop: '16px',
                                padding: '12px',
                                fontSize: '1.1rem',
                                borderRadius: '8px'
                            }, children: isLoading ? 'Authenticating...' : 'Login' })] }), _jsxs("p", { style: { textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }, children: ["Don't have an account?", ' ', _jsx(Link, { to: "/signup", style: { color: 'var(--primary)', fontWeight: 700 }, children: "Sign Up" })] })] }) }));
}
