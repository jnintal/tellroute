"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Background with grid pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full filter blur-[128px] opacity-20 ${mounted ? 'animate-float' : ''}`} />
        <div className={`absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full filter blur-[128px] opacity-20 ${mounted ? 'animate-float' : ''}`} style={{ animationDelay: '3s' }} />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">Route</span>
          </div>
          
          <div className="flex gap-4">
            <a href="https://accounts.tellroute.com/sign-in?redirect_url=https://tellroute.com/dashboard" 
               className="px-6 py-2 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
              Dashboard Login
            </a>
            <a href="mailto:contact@tellroute.com" 
               className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
              Contact Sales
            </a>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
              <span className={`${mounted ? 'animate-pulse' : ''} mr-2`}>●</span>
              AI-Powered Voice Technology
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                AI Voice Assistant
              </span>
              <br />
              <span className="text-white">for Your Business</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Never miss a customer call again. Our AI handles appointments, inquiries, 
              and support 24/7 with human-like conversations.
            </p>
            
            <a href="mailto:contact@tellroute.com" 
               className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25">
              Get Started
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                1M+
              </div>
              <div className="text-gray-400">Calls Handled Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                2,000+
              </div>
              <div className="text-gray-400">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-gray-400">Uptime Guarantee</div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div id="features" className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Restaurants</h3>
              <p className="text-gray-400">Handle reservations, takeout orders, hours inquiries, and menu questions with perfect accuracy.</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Real Estate</h3>
              <p className="text-gray-400">Schedule property viewings, answer listing questions, and qualify leads automatically 24/7.</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Service Businesses</h3>
              <p className="text-gray-400">Book appointments, provide instant quotes, and handle customer support with AI precision.</p>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-32 text-center">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-12 rounded-3xl max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-xl text-gray-400 mb-8">Join thousands of businesses already using Route to handle their calls.</p>
              <a href="mailto:contact@tellroute.com" 
                 className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25">
                Schedule a Demo
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 mt-32 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-bold mb-2">Route</div>
              <p className="text-gray-400">AI Voice Assistant for Modern Businesses</p>
            </div>
            <div className="text-gray-400">
              © 2025 The Route AI Limited Liability Company. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}