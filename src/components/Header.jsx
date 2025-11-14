import React from 'react';
import { ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/solid';

function Header() {
  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold">GrowthCast</h1>
          </div>

          {/* User Profile Icon */}
          <div className="flex items-center">
            <UserCircleIcon className="h-10 w-10 text-slate-300 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
