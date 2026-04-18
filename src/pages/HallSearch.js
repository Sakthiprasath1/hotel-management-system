import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Users, Wifi, CheckCircle } from 'lucide-react';
export default function HallSearch() {
    const { halls, user, setReservations, reservations } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [selectedHall, setSelectedHall] = useState(null);
    const [bookingDates, setBookingDates] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const filteredHalls = halls.filter(hall => {
        const matchesSearch = hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hall.hallNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || hall.type === filterType;
        return matchesSearch && matchesType;
    });
    const handleBookNow = async () => {
        if (!selectedHall || !bookingDates || !user)
            return;
        setIsBooking(true);
        const newReservation = {
            id: 'RES-' + Math.floor(Math.random() * 10000),
            userId: user.id,
            guestName: user.name,
            dates: bookingDates,
            hallId: selectedHall.id,
            status: 'Confirmed',
            amount: selectedHall.price,
            paymentStatus: 'Pending'
        };
        try {
            const res = await fetch('http://localhost:5001/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReservation)
            });
            if (res.ok) {
                setReservations([...reservations, await res.json()]);
                alert("Booking successful! You can view it in 'My Bookings'.");
                setSelectedHall(null);
                setBookingDates('');
            }
        }
        catch (e) {
            alert("Booking failed. Please try again.");
        }
        finally {
            setIsBooking(false);
        }
    };
    return (_jsxs("div", { className: "hall-search-page", children: [_jsxs("div", { className: "hero-section card glass-card", style: { marginBottom: '32px', padding: '40px', background: 'linear-gradient(135deg, var(--primary) 0%, #2980b9 100%)', color: 'white' }, children: [_jsx("h1", { style: { fontSize: '2.5rem', marginBottom: '16px' }, children: "Find the Perfect Hall for your Vibe" }), _jsx("p", { style: { fontSize: '1.2rem', opacity: 0.9, marginBottom: '24px' }, children: "Luxury venues for weddings, conferences, and celebrations." }), _jsxs("div", { style: { display: 'flex', gap: '12px', background: 'white', padding: '8px', borderRadius: '12px' }, children: [_jsxs("div", { style: { flex: 1, display: 'flex', alignItems: 'center', padding: '0 12px', borderRight: '1px solid #ddd' }, children: [_jsx(Search, { size: 20, color: "#666" }), _jsx("input", { style: { border: 'none', width: '100%', padding: '12px', fontSize: '1rem', color: '#000' }, placeholder: "Search by hall name or number...", value: searchTerm, onChange: e => setSearchTerm(e.target.value) })] }), _jsxs("select", { style: { border: 'none', padding: '12px', fontSize: '1rem', width: '150px' }, value: filterType, onChange: e => setFilterType(e.target.value), children: [_jsx("option", { children: "All Types" }), _jsx("option", { children: "Standard" }), _jsx("option", { children: "Deluxe" }), _jsx("option", { children: "Suite" })] }), _jsx("button", { className: "btn", style: { padding: '0 32px' }, children: "Explore" })] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }, children: filteredHalls.map(hall => (_jsxs("div", { className: "card glass-card hall-card", style: { padding: 0, overflow: 'hidden', transition: 'transform 0.3s ease' }, children: [_jsxs("div", { style: { height: '200px', background: '#ddd', position: 'relative' }, children: [_jsx("div", { style: { position: 'absolute', top: '12px', right: '12px' }, children: _jsx("span", { className: `status-badge ${hall.status.toLowerCase()}`, children: hall.status }) }), _jsx("img", { src: `https://source.unsplash.com/featured/?hall,luxury,${hall.id}`, alt: hall.name, style: { width: '100%', height: '100%', objectFit: 'cover' } })] }), _jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }, children: [_jsx("h3", { style: { fontSize: '1.4rem' }, children: hall.name }), _jsxs("span", { style: { fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }, children: ["\u20B9", hall.price.toLocaleString()] })] }), _jsxs("p", { style: { color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }, children: [_jsx(MapPin, { size: 14 }), " Room ", hall.hallNo, " \u2022 ", hall.type] }), _jsxs("div", { style: { display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '0.9rem', color: '#555' }, children: [_jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: '4px' }, children: [_jsx(Users, { size: 16 }), " Up to ", hall.capacity] }), _jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: '4px' }, children: [_jsx(Wifi, { size: 16 }), " Free Wifi"] })] }), _jsx("button", { className: "btn", style: { width: '100%' }, onClick: () => setSelectedHall(hall), disabled: hall.status !== 'Available', children: hall.status === 'Available' ? 'Book Now' : 'Not Available' })] })] }, hall.id))) }), selectedHall && (_jsx("div", { className: "modal-overlay", children: _jsxs("div", { className: "modal-content glass-card", style: { maxWidth: '450px' }, children: [_jsxs("div", { className: "modal-header", children: [_jsxs("h2", { children: ["Confirm Booking: ", selectedHall.name] }), _jsx("button", { className: "btn-icon", onClick: () => setSelectedHall(null), style: { fontSize: '1.5rem' }, children: "\u00D7" })] }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("p", { style: { color: 'var(--text-muted)', fontSize: '0.9rem' }, children: "Check-in/out Dates" }), _jsx("input", { type: "text", placeholder: "e.g. Oct 20 - Oct 22", required: true, style: { marginTop: '8px' }, value: bookingDates, onChange: e => setBookingDates(e.target.value) })] }), _jsxs("div", { className: "card", style: { backgroundColor: '#f8f9fa', border: 'none', marginBottom: '20px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }, children: [_jsx("span", { children: "Hall Charge" }), _jsxs("span", { children: ["\u20B9", selectedHall.price.toLocaleString()] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #ddd', marginBottom: '8px' }, children: [_jsx("span", { children: "Service Fee" }), _jsx("span", { children: "\u20B9500" })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }, children: [_jsx("span", { children: "Total Amount" }), _jsxs("span", { children: ["\u20B9", (selectedHall.price + 500).toLocaleString()] })] })] }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { className: "btn-secondary", onClick: () => setSelectedHall(null), children: "Cancel" }), _jsx("button", { className: "btn", onClick: handleBookNow, disabled: isBooking || !bookingDates, style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: isBooking ? 'Processing...' : _jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 18 }), " Confirm Reservation"] }) })] })] }) }))] }));
}
