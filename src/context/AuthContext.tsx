import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Backend එකෙන් එන User Model එකට ගැලපෙන්න Type එක හැදුවා
export interface User {
    id: string;
    username: string; // Backend sends username
    email: string;
    role: string; // 'CUSTOMER', 'ADMIN' (Accepts string to be safe)
    token?: string; // JWT Token
    imageUrl?: string;
    provider?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // App එක Load වෙද්දි LocalStorage එකේ User ඉන්නවද බලනවා
        const initAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to parse user data", error);
                localStorage.removeItem('user'); // Data අවුල් නම් අයින් කරනවා
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (userData: User) => {
        // ✅ User Data + Token Save කරනවා
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        // ✅ Role check logic (Capital/Simple දෙකම Check කරනවා Safe වෙන්න)
        if (userData.role === 'ADMIN' || userData.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};