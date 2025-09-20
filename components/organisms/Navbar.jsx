"use client";
import React from 'react';
import MobileNavigation from '@/components/molecules/MobileNavigation';
import DesktopHeader from '@/components/molecules/DesktopHeader';

const Navbar = () => {
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <MobileNavigation />
      <DesktopHeader />
    </div>
  );
};

export default Navbar