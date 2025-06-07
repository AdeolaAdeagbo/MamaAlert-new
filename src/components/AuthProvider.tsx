
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  pregnancyWeek?: number;
  dueDate?: string;
  emergencyContacts: number;
  isHighRisk?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("mamaalert-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock authentication - replace with Supabase auth
    const mockUser: User = {
      id: "1",
      email,
      firstName: "Fatima",
      lastName: "Mohammed",
      pregnancyWeek: 24,
      dueDate: "2024-06-15",
      emergencyContacts: 3,
      isHighRisk: false
    };
    setUser(mockUser);
    localStorage.setItem("mamaalert-user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    // Mock signup - replace with Supabase auth
    const mockUser: User = {
      id: "1",
      email,
      firstName,
      lastName,
      pregnancyWeek: 12,
      dueDate: "2024-09-01",
      emergencyContacts: 0,
      isHighRisk: false
    };
    setUser(mockUser);
    localStorage.setItem("mamaalert-user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mamaalert-user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
