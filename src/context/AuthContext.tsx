import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type User = { id: string; name: string; email: string; role: 'admin' | 'guest' | 'receptionist'; phone: string };
export type Room = { id: string; roomNo: string; name: string; type: string; capacity: number; amenities: string[]; status: string; price: number; image?: string };
export type Reservation = { id: string; userId: string; guestName: string; dates: string; roomId: string; status: string; amount: number; paymentStatus: string };
export type Staff = { id: string; name: string; role: string; shift: string; status: string };
export type Payment = { id: string; reservationId: string; userId: string; amount: number; status: string; method: string; createdAt: string };
export type Notification = { id: string; userId: string; message: string; type: string; isRead: boolean; createdAt: string };
export type ServiceRequest = { id: string; userId: string; guestName: string; roomNo: string; type: string; status: string; createdAt: string };


interface AuthContextType {
  user: User | null;
  rooms: Room[];
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
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setServiceRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isReceptionist = user?.role === 'receptionist';
  const isGuest = user?.role === 'guest';

  const fetchData = async () => {
    try {
      const baseUrl = `http://${window.location.hostname}:5001`;
      
      // Public data (available for guests)
      const roomsRes = await fetch(`${baseUrl}/rooms`);
      setRooms(await roomsRes.json());

      // Authenticated data
      if (isAuthenticated) {
        const [reservationsRes, notificationsRes, servicesRes] = await Promise.all([
          fetch(`${baseUrl}/reservations`),
          fetch(`${baseUrl}/notifications`),
          fetch(`${baseUrl}/serviceRequests`)
        ]);
        setReservations(await reservationsRes.json());
        setNotifications(await notificationsRes.json());
        setServiceRequests(await servicesRes.json());

        // Admin/Receptionist data
        if (isAdmin || isReceptionist) {
          const [staffRes, paymentsRes] = await Promise.all([
            fetch(`${baseUrl}/staff`),
            fetch(`${baseUrl}/payments`)
          ]);
          setStaff(await staffRes.json());
          setPayments(await paymentsRes.json());
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

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
      user, rooms, reservations, staff, payments, notifications, serviceRequests,
      isAuthenticated, isAdmin, isReceptionist, isGuest,
      setRooms, setReservations, setStaff, setPayments, setNotifications, setServiceRequests,
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
