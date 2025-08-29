import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Role, OrgPlan } from '../types';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  orgPlan: OrgPlan | null;
  orgId: number | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: Role[]) => boolean;
  isPremium: boolean;
}

interface JwtPayload {
  sub: string; // userId
  role: Role;
  orgId: number;
  orgPlan: OrgPlan;
  exp: number;
  iat: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [orgPlan, setOrgPlan] = useState<OrgPlan | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('jwt');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const decoded = jwtDecode<JwtPayload>(savedToken);
        
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setRole(decoded.role);
          setOrgPlan(decoded.orgPlan);
          setOrgId(decoded.orgId);
        } else {
          // Token expired, clear storage
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    try {
      const decoded = jwtDecode<JwtPayload>(newToken);
      
      setToken(newToken);
      setUser(userData);
      setRole(decoded.role);
      setOrgPlan(decoded.orgPlan);
      setOrgId(decoded.orgId);
      
      localStorage.setItem('jwt', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    setOrgPlan(null);
    setOrgId(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  const hasRole = (roles: Role[]): boolean => {
    return role ? roles.includes(role) : false;
  };

  const isAuthenticated = !!token && !!user;
  const isPremium = orgPlan === 'PREMIUM';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        orgPlan,
        orgId,
        login,
        logout,
        isAuthenticated,
        hasRole,
        isPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};