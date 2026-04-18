import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const handleSubmit = async (e) => {
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
            const baseUrl = 'http://localhost:5001';
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
            }
            else {
                throw new Error('Failed to create account');
            }
        }
        catch (error) {
            console.error("Signup error:", error);
            alert("Registration failed. Make sure the server is running on port 5001.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "auth-container", style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '40px 20px',
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }, children: _jsxs("div", { className: "card glass-card", style: { width: '100%', maxWidth: '450px', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(15px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)' }, children: [_jsx("h2", { style: { textAlign: 'center', marginBottom: '8px', color: 'var(--primary)', fontSize: '2rem', fontWeight: 800 }, children: "Vibe Stays" }), _jsx("p", { style: { textAlign: 'center', color: 'var(--text-muted)', marginBottom: '24px' }, children: "Create your guest account" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Full Name" }), _jsx("input", { required: true, placeholder: "Your Name", value: name, onChange: e => setName(e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Email Address" }), _jsx("input", { type: "email", required: true, placeholder: "name@example.com", value: email, onChange: e => setEmail(e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Phone Number" }), _jsx("input", { required: true, placeholder: "10-digit number", value: phone, onChange: e => setPhone(e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Password" }), _jsx("input", { type: "password", required: true, placeholder: "Create password", value: password, onChange: e => setPassword(e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Confirm Password" }), _jsx("input", { type: "password", required: true, placeholder: "Repeat password", value: confirmPassword, onChange: e => setConfirmPassword(e.target.value) })] }), _jsx("button", { type: "submit", className: "btn", disabled: isLoading, style: {
                                width: '100%',
                                marginTop: '16px',
                                padding: '14px',
                                fontSize: '1.1rem',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease'
                            }, children: isLoading ? 'Processing...' : 'Register as Guest' })] }), _jsxs("p", { style: { textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }, children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", style: { color: 'var(--primary)', fontWeight: 700 }, children: "Login" })] })] }) }));
}
