"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PublicHomePage() {


  return (
    <main className="min-h-screen relative overflow-hidden bg-background text-foreground font-sans p-6 flex flex-col items-center justify-center text-center">
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
      
      {/* Animated background using a simple CSS gradient animation */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-zinc-900 to-blue-800 animate-pulse-slow"></div>
      </div>
      
      <div className="relative z-10 max-w-2xl">
        <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl font-extrabold tracking-tight text-foreground drop-shadow-lg"
        >
          Welcome to TaskMaster
        </motion.h1>
        <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="text-xl text-muted-foreground mt-4"
        >
          The over-engineered, real-time solution to manage your daily tasks.
        </motion.p>
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 transform active:scale-95 cursor-pointer"
            >
              Login
            </motion.div>
          </Link>
          <Link href="/register">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 font-semibold text-secondary-foreground bg-secondary rounded-lg shadow-lg hover:bg-zinc-700 transition-all duration-200 transform active:scale-95 cursor-pointer"
            >
              Register
            </motion.div>
          </Link>
        </div>
      </div>
    </main>
  );
}
