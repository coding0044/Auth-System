'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, []);

  useEffect(() => {
    fetchUser(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchUser]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Auth System
          </Link>
          
          <div className="flex space-x-4">
            {!user ? (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/signup" className="text-gray-600 hover:text-gray-900">
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link href={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} 
                  className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}