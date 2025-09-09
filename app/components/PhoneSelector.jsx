// app/components/PhoneSelector.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function PhoneSelector() {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { userId } = useAuth();

  useEffect(() => {
    // For production - this user only has one number
    // Later this will fetch from your database based on the user's email/ID
    const userPhones = [
      { id: 1, number: '+12133548232' }
    ];
    
    setPhoneNumbers(userPhones);
    // Set default selected phone
    if (userPhones.length > 0) {
      setSelectedPhone(userPhones[0].number);
      localStorage.setItem('selectedPhone', userPhones[0].number);
    }
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhoneSelect = (phone) => {
    setSelectedPhone(phone.number);
    localStorage.setItem('selectedPhone', phone.number);
    setIsOpen(false);
    window.location.reload();
  };

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return number;
  };

  if (phoneNumbers.length === 0) {
    return null;
  }

  const currentPhone = phoneNumbers.find(p => p.number === selectedPhone) || phoneNumbers[0];

  // If only one phone number, just display it without dropdown
  if (phoneNumbers.length === 1) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-300">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="font-mono text-white">{formatPhoneNumber(currentPhone.number)}</span>
      </div>
    );
  }

  // Multiple phone numbers - show dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="font-mono">{formatPhoneNumber(currentPhone.number)}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-64 overflow-y-auto">
          {phoneNumbers.map((phone) => (
            <button
              key={phone.id}
              onClick={() => handlePhoneSelect(phone)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center justify-between ${
                selectedPhone === phone.number ? 'bg-gray-700/50' : ''
              }`}
            >
              <span className="text-white font-mono text-sm">{formatPhoneNumber(phone.number)}</span>
              {selectedPhone === phone.number && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}