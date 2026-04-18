import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
import { Home, Users, Bed, CalendarCheck, BarChart3, Bell, User, LogOut, Search, CreditCard } from 'lucide-react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Reservations from './pages/Reservations';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoomSearch from './pages/RoomSearch';
import MyBookings from './pages/MyBookings';
import UserManagement from './pages/UserManagement';
import PaymentManagement from './pages/PaymentManagement';
import Payment from './pages/Payment';
import Services from './pages/Services';

const Topbar = () => {
  const { user, logout } = useAuth();
  return (
    <div className="topbar">
      <div className="topbar-title">Vibe Stays</div>
      <div className="topbar-actions">
        <button className="btn-icon"><Bell size={20} /></button>
        <div className="avatar-wrapper">
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name}</span>
          <div className="avatar"><User size={18} /></div>
        </div>
        <button className="premium-btn" style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'auto', borderRadius: '100px' }} onClick={logout}>
          <LogOut size={16} style={{ marginRight: '4px' }} /> Logout
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { isAdmin, isReceptionist } = useAuth();
  const currentPath = window.location.pathname;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link to={to} className={`nav-link ${currentPath === to ? 'active' : ''}`}>
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="sidebar">
      <nav className="nav-menu">
        {isAdmin ? (
          <>
            <NavItem to="/" icon={Home} label="Dashboard" />
            <NavItem to="/rooms" icon={Bed} label="Rooms" />
            <NavItem to="/reservations" icon={CalendarCheck} label="Bookings" />
            <NavItem to="/users" icon={Users} label="Users" />
            <NavItem to="/payments" icon={CreditCard} label="Payments" />
            <NavItem to="/staff" icon={Users} label="Staff" />
            <NavItem to="/reports" icon={BarChart3} label="Reports" />
          </>
        ) : isReceptionist ? (
          <>
            <NavItem to="/" icon={Home} label="Dashboard" />
            <NavItem to="/rooms" icon={Bed} label="Rooms (View)" />
            <NavItem to="/reservations" icon={CalendarCheck} label="Manage Bookings" />
            <NavItem to="/payments" icon={CreditCard} label="Billing & Invoices" />
          </>
        ) : (
          <>
            <NavItem to="/" icon={Home} label="Home" />
            <NavItem to="/room-search" icon={Search} label="Search Rooms" />
            <NavItem to="/my-bookings" icon={CalendarCheck} label="My Bookings" />
            <NavItem to="/services" icon={Bell} label="Request Services" />
          </>
        )}
      </nav>
    </div>
  );
};

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Topbar />
      <div className="main-container">
        <Sidebar />
        <main className="content" style={{ padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function AppRoutes() {
  const { isAdmin, isReceptionist } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/" element={<AppLayout />}>
        <Route index element={(isAdmin || isReceptionist) ? <Dashboard /> : <RoomSearch />} />
        
        <Route path="room-search" element={<RoomSearch />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="payment" element={<Payment />} />
        <Route path="services" element={<Services />} />

        {(isAdmin || isReceptionist) && (
          <>
            <Route path="rooms" element={<Rooms />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="payments" element={<PaymentManagement />} />
          </>
        )}

        {isAdmin && (
          <>
            <Route path="users" element={<UserManagement />} />
            <Route path="staff" element={<Staff />} />
            <Route path="reports" element={<Reports />} />
          </>
        )}
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
