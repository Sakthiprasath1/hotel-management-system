import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Receipt, Clock, CheckCircle, XCircle } from 'lucide-react';
export default function MyBookings() {
    const { user, reservations, halls, setReservations } = useAuth();
    // Filter bookings for the current guest
    const myReservations = reservations.filter(res => res.userId === user?.id);
    const getHallInfo = (hallId) => {
        return halls.find(h => h.id === hallId);
    };
    const handleCancelBooking = async (resId) => {
        if (!window.confirm("Are you sure you want to cancel this booking? Cancellation policies may apply."))
            return;
        try {
            const res = await fetch(`http://localhost:5001/reservations/${resId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Cancelled', paymentStatus: 'Refunded' })
            });
            if (res.ok) {
                const updated = await res.json();
                setReservations(reservations.map(r => r.id === resId ? updated : r));
                alert("Booking cancelled successfully.");
            }
        }
        catch (e) {
            alert("Failed to cancel booking.");
        }
    };
    return (_jsxs("div", { className: "my-bookings-page", children: [_jsxs("div", { className: "page-header", children: [_jsx("h1", { className: "page-title", children: "My Venue Bookings" }), _jsx("p", { style: { color: 'var(--text-muted)' }, children: "Manage your upcoming stays and past reservations." })] }), _jsx("div", { style: { display: 'grid', gap: '20px' }, children: myReservations.length === 0 ? (_jsxs("div", { className: "card glass-card", style: { textAlign: 'center', padding: '60px' }, children: [_jsx(Calendar, { size: 48, style: { marginBottom: '16px', opacity: 0.3 } }), _jsx("h3", { children: "No bookings yet" }), _jsx("p", { style: { color: 'var(--text-muted)' }, children: "Your booked halls will appear here." })] })) : (myReservations.map(res => {
                    const hall = getHallInfo(res.hallId);
                    return (_jsxs("div", { className: "card glass-card", style: { display: 'flex', gap: '24px', padding: '24px', alignItems: 'center' }, children: [_jsx("div", { style: { width: '120px', height: '120px', borderRadius: '12px', background: '#eee', overflow: 'hidden' }, children: _jsx("img", { src: `https://source.unsplash.com/featured/?hall,room,${res.hallId}`, alt: "Hall", style: { width: '100%', height: '100%', objectFit: 'cover' } }) }), _jsxs("div", { style: { flex: 1 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }, children: [_jsx("h3", { style: { fontSize: '1.2rem' }, children: hall?.name || 'Grand Ballroom' }), _jsx("span", { className: `status-badge ${res.status.toLowerCase().replace(' ', '-')}`, children: res.status })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '0.9rem' }, children: [_jsx(Calendar, { size: 16 }), " ", res.dates] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '0.9rem' }, children: [_jsx(MapPin, { size: 16 }), " Hall ", hall?.hallNo || 'N/A'] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '0.9rem' }, children: [_jsx(Receipt, { size: 16 }), " \u20B9", res.amount.toLocaleString(), " (", res.paymentStatus, ")"] })] }), _jsxs("div", { style: { display: 'flex', gap: '12px' }, children: [_jsxs("button", { className: "btn-secondary", style: { padding: '8px 16px', fontSize: '0.9rem' }, children: [_jsx(Info, { size: 16, style: { marginRight: '4px' } }), " View Details"] }), (res.status !== 'Checked Out' && res.status !== 'Cancelled') && (_jsxs("button", { className: "btn-secondary btn-danger", style: { padding: '8px 16px', fontSize: '0.9rem' }, onClick: () => handleCancelBooking(res.id), children: [_jsx(XCircle, { size: 16, style: { marginRight: '4px' } }), " Cancel Booking"] }))] })] }), _jsxs("div", { style: { textAlign: 'right', borderLeft: '1px solid #ddd', paddingLeft: '24px' }, children: [_jsx("p", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }, children: "Booking ID" }), _jsx("p", { style: { fontWeight: 700, letterSpacing: '1px' }, children: res.id }), _jsxs("div", { style: { marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px', color: res.paymentStatus === 'Paid' ? '#27ae60' : '#e67e22', fontWeight: 600 }, children: [res.paymentStatus === 'Paid' ? _jsx(CheckCircle, { size: 16 }) : _jsx(Clock, { size: 16 }), res.paymentStatus] })] })] }, res.id));
                })) })] }));
}
