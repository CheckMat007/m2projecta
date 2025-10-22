// src/components/ui/Logo.tsx
import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <Image 
      src="/logo_2.png" 
      alt="M2 Projecta Logo"
      width={2048}  
      height={500} 
      className="h-full w-auto"
      priority={true} 
    />
  );
};

export default Logo;