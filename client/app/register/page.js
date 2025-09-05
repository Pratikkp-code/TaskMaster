"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import authService from '../../services/auth.service.js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await authService.register(name, email, password);
      router.push('/login');
    } catch (error) {
      const resMessage = (error.response?.data?.msg) || error.message || error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background text-foreground font-sans p-6 flex items-center justify-center">
      <style>
        {`
        /* Keyframe animation for the background pulse effect */
        @keyframes pulse-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
          background-size: 200% 200%;
        }
        `}
      </style>

      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-zinc-900 to-blue-800 animate-pulse-slow"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-xl border border-border">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl font-extrabold text-center text-card-foreground tracking-wide"
        >
          Create an Account
        </motion.h2>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          onSubmit={handleRegister}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-card-foreground bg-secondary border-2 border-transparent rounded-lg focus:outline-none focus:border-primary transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-card-foreground bg-secondary border-2 border-transparent rounded-lg focus:outline-none focus:border-primary transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-card-foreground bg-secondary border-2 border-transparent rounded-lg focus:outline-none focus:border-primary transition-colors duration-200"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-cyan-700 transition-all shadow-md transform active:scale-95"
          >
            Register
          </motion.button>
          {message && <p className="text-center text-red-500">{message}</p>}
        </motion.form>
          <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
