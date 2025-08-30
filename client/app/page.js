"use client";

import Link from 'next/link';

export default function PublicHomePage() {


  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0D1B2A] text-gray-200 font-sans p-6 flex flex-col items-center justify-center text-center">
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
      
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-wider mb-4 text-white">
          Welcome to TaskMaster
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          The over-engineered, real-time solution to manage your daily.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="px-6 py-3 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors shadow-md transform active:scale-95">
            Login
          </Link>
          <Link href="/register" className="px-6 py-3 font-semibold text-white bg-[#1B263B] rounded-lg hover:bg-[#243555] transition-colors shadow-md transform active:scale-95">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
