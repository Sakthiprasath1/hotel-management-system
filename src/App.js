import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
import { Home, Users, Bed, CalendarCheck, BarChart3, Bell, User, LogOut, Search, CreditCard } from 'lucide-react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Halls from './pages/Halls';
import Reservations from './pages/Reservations';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HallSearch from './pages/HallSearch';
import MyBookings from './pages/MyBookings';
import UserManagement from './pages/UserManagement';
import PaymentManagement from './pages/PaymentManagement';
const Topbar = () => {
    const { user, logout } = useAuth();
    return (_jsxs("div", { className: "topbar", children: [_jsxs("div", { className: "topbar-title", children: ["Vibe Stays ", user?.role === 'admin' ? 'Admin' : ''] }), _jsxs("div", { className: "topbar-actions", children: [_jsxs("span", { style: { fontSize: '0.9rem', color: 'var(--text-muted)' }, children: ["Hello, ", user?.name] }), _jsx("button", { className: "btn-icon", children: _jsx(Bell, { size: 20 }) }), _jsx("div", { className: "avatar", children: _jsx(User, { size: 20 }) }), _jsxs("button", { className: "btn-secondary", style: { padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }, onClick: logout, children: [_jsx(LogOut, { size: 16 }), " Logout"] })] })] }));
};
const Sidebar = () => {
    const { isAdmin } = useAuth();
    return (_jsx("div", { className: "sidebar", children: _jsx("nav", { className: "nav-menu", children: isAdmin ? (_jsxs(_Fragment, { children: [_jsxs(Link, { to: "/", className: "nav-link", children: [_jsx(Home, { size: 20 }), " ", _jsx("span", { children: "Dashboard" })] }), _jsxs(Link, { to: "/halls", className: "nav-link", children: [_jsx(Bed, { size: 20 }), " ", _jsx("span", { children: "Halls" })] }), _jsxs(Link, { to: "/reservations", className: "nav-link", children: [_jsx(CalendarCheck, { size: 20 }), " ", _jsx("span", { children: "Bookings" })] }), _jsxs(Link, { to: "/users", className: "nav-link", children: [_jsx(Users, { size: 20 }), " ", _jsx("span", { children: "Users" })] }), _jsxs(Link, { to: "/payments", className: "nav-link", children: [_jsx(CreditCard, { size: 20 }), " ", _jsx("span", { children: "Payments" })] }), _jsxs(Link, { to: "/staff", className: "nav-link", children: [_jsx(Users, { size: 20 }), " ", _jsx("span", { children: "Staff" })] }), _jsxs(Link, { to: "/reports", className: "nav-link", children: [_jsx(BarChart3, { size: 20 }), " ", _jsx("span", { children: "Reports" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs(Link, { to: "/", className: "nav-link", children: [_jsx(Home, { size: 20 }), " ", _jsx("span", { children: "Home" })] }), _jsxs(Link, { to: "/search", className: "nav-link", children: [_jsx(Search, { size: 20 }), " ", _jsx("span", { children: "Search Halls" })] }), _jsxs(Link, { to: "/my-bookings", className: "nav-link", children: [_jsx(CalendarCheck, { size: 20 }), " ", _jsx("span", { children: "My Bookings" })] })] })) }) }));
};
const ProtectedLayout = () => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/login", replace: true });
    return (_jsxs("div", { className: "app-layout", children: [_jsx(Topbar, {}), _jsxs("div", { className: "main-container", children: [_jsx(Sidebar, {}), _jsx("main", { className: "content", children: _jsx(Outlet, {}) })] })] }));
};
function AppRoutes() {
    const { isAdmin } = useAuth();
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/signup", element: _jsx(Signup, {}) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedLayout, {}), children: [_jsx(Route, { index: true, element: isAdmin ? _jsx(Dashboard, {}) : _jsx(HallSearch, {}) }), isAdmin ? (_jsxs(_Fragment, { children: [_jsx(Route, { path: "halls", element: _jsx(Halls, {}) }), _jsx(Route, { path: "reservations", element: _jsx(Reservations, {}) }), _jsx(Route, { path: "users", element: _jsx(UserManagement, {}) }), _jsx(Route, { path: "payments", element: _jsx(PaymentManagement, {}) }), _jsx(Route, { path: "staff", element: _jsx(Staff, {}) }), _jsx(Route, { path: "reports", element: _jsx(Reports, {}) })] })) : (_jsxs(_Fragment, { children: [_jsx(Route, { path: "search", element: _jsx(HallSearch, {}) }), _jsx(Route, { path: "my-bookings", element: _jsx(MyBookings, {}) })] }))] })] }));
}
function App() {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsx(AppRoutes, {}) }) }));
}
export default App;
