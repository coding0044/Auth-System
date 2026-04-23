'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type User = {
  role: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🔐 AuthSystem
          </div>
          <div className="flex gap-4">
            {!user ? (
              <>
                <Link href="/login" className="px-6 py-2 text-indigo-600 font-semibold hover:text-indigo-700">
                  Login
                </Link>
                <Link href="/signup" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                  Sign Up
                </Link>
              </>
            ) : (
              <Link href={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Secure Authentication System
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A modern, fully-featured authentication system with login, signup, password recovery, and role-based dashboards. Built with Next.js, MongoDB, and JWT for maximum security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {!user ? (
                <>
                  <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-indigo-400/30 transition transform hover:scale-105">
                    🔓 Login
                  </Link>
                  <Link href="/signup" className="px-8 py-4 border-2 border-indigo-200 text-indigo-600 rounded-xl font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition">
                    ✨ Create Account
                  </Link>
                </>
              ) : (
                <Link href={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition">
                  📊 Go to Dashboard
                </Link>
              )}
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-2xl blur-3xl opacity-30"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg animate-pulse delay-100"></div>
                <div className="h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">✨ Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Authentication</h3>
              <p className="text-white/80">JWT tokens with HTTP-only cookies and protected server routes for maximum security.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-3">Role-Based Access</h3>
              <p className="text-white/80">Different dashboards and controls for admins and regular users with granular permissions.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🔑</div>
              <h3 className="text-xl font-bold text-white mb-3">Password Recovery</h3>
              <p className="text-white/80">Secure password reset flows with email verification and token-based links.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">🛠️ Built With</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-100 text-center">
            <div className="text-4xl mb-3">⚛️</div>
            <h3 className="font-bold text-gray-900">Next.js 16</h3>
            <p className="text-sm text-gray-600 mt-2">React framework with App Router</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 text-center">
            <div className="text-4xl mb-3">🍃</div>
            <h3 className="font-bold text-gray-900">MongoDB</h3>
            <p className="text-sm text-gray-600 mt-2">NoSQL database for data storage</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-pink-100 text-center">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-gray-900">Tailwind CSS</h3>
            <p className="text-sm text-gray-600 mt-2">Utility-first styling framework</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100 text-center">
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="font-bold text-gray-900">JWT & Bcrypt</h3>
            <p className="text-sm text-gray-600 mt-2">Secure authentication & encryption</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-white/80 mb-8">Create your account and explore our amazing content dashboard today!</p>
          {!user ? (
            <Link href="/signup" className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105">
              🚀 Create Free Account
            </Link>
          ) : (
            <Link href={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105">
              📊 Open Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 AuthSystem. All rights reserved. Built with ❤️ for secure authentication.</p>
        </div>
      </footer>
    </div>
  );
}