'use client'; // Client-side component for form handling

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'; // Environment variable se password, ya default 'admin123'

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate a delay for login process
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      // Password sahi hai, admin session set karein (real app mein JWT token ya session ID hoga)
      // Abhi ke liye, hum localStorage use kar rahe hain simple demo ke liye.
      localStorage.setItem('is_admin_logged_in', 'true');
      router.push('/admin'); // Admin dashboard par redirect karein
    } else {
      setError('Invalid password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-md w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-gray-800 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-emerald-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
