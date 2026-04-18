import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import dbData from '../../db.json';
import hotelData from '../data/hotelData.json';

export type User = { id: string; name: string; email: string; role: 'admin' | 'guest' | 'receptionist'; phone: string; password?: string };
export type Room = { id: string; roomNo: string; name: string; type: string; capacity: number; amenities: string[]; status: string; price: number; image?: string };
export type Hall = { id: string; hallNo: string; name: string; type: string; capacity: number; amenities: string[]; status: string; price: number; image?: string };
export type Reservation = { id: string; userId: string; guestName: string; dates: string; roomId: string; status: string; amount: number; paymentStatus: string; roomName?: string };
export type Staff = { id: string; name: string; role: string; shift: string; status: string };
export type Payment = { id: string; reservationId: string; userId: string; amount: number; status: string; method: string; createdAt: string };
export type Notification = { id: string; userId: string; message: string; type: string; isRead: boolean; createdAt: string };
export type ServiceRequest = { id: string; userId: string; guestName: string; roomNo: string; type: string; status: string; createdAt: string };


interface AuthContextType {
  user: User | null;
  users: User[];
  rooms: Room[];
  halls: Hall[];
  reservations: Reservation[];
  staff: Staff[];
  payments: Payment[];
  notifications: Notification[];
  serviceRequests: ServiceRequest[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isReceptionist: boolean;
  isGuest: boolean;
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  setHalls: React.Dispatch<React.SetStateAction<Hall[]>>;
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setServiceRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  login: (userData: User) => void;
  logout: () => void;
  fetchData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vibe_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Helper to load from localStorage or initial data
  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [users, setUsers] = useState<User[]>(() => getInitialData('vibe_users', dbData.users));
  const [rooms, setRooms] = useState<Room[]>(() => getInitialData('vibe_rooms', dbData.rooms));
  const [halls, setHalls] = useState<Hall[]>(() => getInitialData('vibe_halls', hotelData.halls));
  const [reservations, setReservations] = useState<Reservation[]>(() => getInitialData('vibe_reservations', dbData.reservations));
  const [staff, setStaff] = useState<Staff[]>(() => getInitialData('vibe_staff', dbData.staff));
  const [payments, setPayments] = useState<Payment[]>(() => getInitialData('vibe_payments', dbData.payments));
  const [notifications, setNotifications] = useState<Notification[]>(() => getInitialData('vibe_notifications', dbData.notifications));
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => getInitialData('vibe_serviceRequests', dbData.serviceRequests));

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isReceptionist = user?.role === 'receptionist';
  const isGuest = user?.role === 'guest';

  // Persistence effects
  useEffect(() => { localStorage.setItem('vibe_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('vibe_rooms', JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem('vibe_halls', JSON.stringify(halls)); }, [halls]);
  useEffect(() => { localStorage.setItem('vibe_reservations', JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem('vibe_staff', JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem('vibe_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('vibe_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('vibe_serviceRequests', JSON.stringify(serviceRequests)); }, [serviceRequests]);

  const fetchData = async () => {
    // No-op - data is already in state and updated via setters
    console.log("Using local data store");
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('vibe_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vibe_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, users, rooms, halls, reservations, staff, payments, notifications, serviceRequests,
      isAuthenticated, isAdmin, isReceptionist, isGuest,
      setRooms, setHalls, setReservations, setStaff, setPayments, setNotifications, setServiceRequests, setUsers,
      login, logout, fetchData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
