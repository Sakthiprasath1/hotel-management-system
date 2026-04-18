import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('vibe_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [halls, setHalls] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [staff, setStaff] = useState([]);
    const [payments, setPayments] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';
    const fetchData = async () => {
        if (!isAuthenticated)
            return;
        try {
            const baseUrl = 'http://localhost:5001';
            const [hallsRes, reservationsRes, staffRes, paymentsRes, notificationsRes] = await Promise.all([
                fetch(`${baseUrl}/halls`),
                fetch(`${baseUrl}/reservations`),
                fetch(`${baseUrl}/staff`),
                fetch(`${baseUrl}/payments`),
                fetch(`${baseUrl}/notifications`)
            ]);
            setHalls(await hallsRes.json());
            setReservations(await reservationsRes.json());
            setStaff(await staffRes.json());
            setPayments(await paymentsRes.json());
            setNotifications(await notificationsRes.json());
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [isAuthenticated]);
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('vibe_user', JSON.stringify(userData));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('vibe_user');
    };
    return (_jsx(AuthContext.Provider, { value: {
            user, halls, reservations, staff, payments, notifications,
            isAuthenticated, isAdmin,
            setHalls, setReservations, setStaff, setPayments, setNotifications,
            login, logout, fetchData
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
