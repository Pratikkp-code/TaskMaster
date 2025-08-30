"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import authService from '../../services/auth.service.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await authService.login(email, password);
      router.push('/dashboard');
    } catch (error) {
      const resMessage = (error.response?.data?.msg) || error.message || error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0D1B2A] text-gray-200 font-sans p-6 flex items-center justify-center">
      <style>
        {`
        /* Keyframes for a high-tech particle animation */
        @keyframes tech-float {
          0% {
            transform: translateY(0) scale(1) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-50vh) scale(1.1) translateX(20px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) scale(1) translateX(0);
            opacity: 0.2;
          }
        }
        
        .particle {
          position: absolute;
          bottom: -20px;
          animation: tech-float linear infinite;
          border-radius: 50%;
        }
        `}
      </style>
      
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <svg 
            key={i} 
            className="particle" 
            style={{ 
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              fill: `hsl(${Math.random() * 60 + 180}, 80%, 60%)`
            }}
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-[#1B263B] rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-white tracking-wide">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-100 bg-[#243555] border-2 border-transparent rounded-lg focus:outline-none focus:border-cyan-500 transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-100 bg-[#243555] border-2 border-transparent rounded-lg focus:outline-none focus:border-cyan-500 transition-colors duration-200"
              required
            />
          </div>
          <button type="submit" className="w-full py-3 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-all shadow-md transform active:scale-95">
            Login
          </button>
          {message && <p className="text-center text-red-500">{message}</p>}
        </form>
        <p className="text-center text-sm text-gray-400">
          No account?{' '}
          <Link href="/register" className="font-medium text-cyan-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}