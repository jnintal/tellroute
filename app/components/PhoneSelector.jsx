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
    // For now, use mock data. Later this will fetch from your database
    const mockPhones = [
      { id: 1, number: '+12133548232', label: 'Main Line' },
      { id: 2, number: '+13103619496', label: 'Support' },
      // Add more numbers as needed
    ];
    
    setPhoneNumbers(mockPhones);
    // Set default selected phone
    if (mockPhones.length > 0) {
      setSelectedPhone(mockPhones[0].number);
      // Store in localStorage for persistence
      localStorage.setItem('selectedPhone', mockPhones[0].number);
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
    // You can add logic here to reload data for the selected phone
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <div className="text-left">
          <div className="text-xs text-gray-400">{currentPhone.label}</div>
          <div className="text-sm text-white font-mono">{formatPhoneNumber(currentPhone.number)}</div>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="py-2">
            {phoneNumbers.map((phone) => (
              <button
                key={phone.id}
                onClick={() => handlePhoneSelect(phone)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                  selectedPhone === phone.number ? 'bg-gray-700/50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">{phone.label}</div>
                    <div className="text-white font-mono">{formatPhoneNumber(phone.number)}</div>
                  </div>
                  {selectedPhone === phone.number && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
          {phoneNumbers.length > 1 && (
            <div className="border-t border-gray-700 px-4 py-2">
              <p className="text-xs text-gray-500">Select a number to view its calls</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}