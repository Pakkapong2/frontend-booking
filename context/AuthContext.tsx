import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItem, deleteItem, setItem } from '../services/storage';
import { useRouter, useSegments } from 'expo-router';

const AuthContext = createContext({
  user: null,
  login: (data) => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inAdminGroup = segments[0] === 'admin';
    const inUserGroup = segments[0] === 'user';

    if (!user && !inAuthGroup) {
      // Redirect to welcome if not logged in and not in auth group
      router.replace('/auth/welcome');
    } else if (user) {
      if (user.role === 'admin' && !inAdminGroup) {
        router.replace('/admin');
      } else if (user.role === 'user' && !inUserGroup) {
        router.replace('/user');
      }
    }
  }, [user, segments, isLoading]);

  async function loadUser() {
    try {
      const storedUser = await getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.log('Failed to load user', e);
    } finally {
      setIsLoading(false);
    }
  }

  const login = async (data) => {
    await setItem('token', data.token);
    await setItem('user', JSON.stringify(data.member));
    setUser(data.member);
  };

  const logout = async () => {
    await deleteItem('token');
    await deleteItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};