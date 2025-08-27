"use client";

import Link from 'next/link';

export default function PublicHomePage() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center p-8 bg-gray-900 text-white">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Welcome to TaskMaster
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          The over-engineered, real-time solution to manage your daily tasks with a stunning UI.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Login
          </Link>
          <Link href="/register" className="px-6 py-3 font-semibold text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}