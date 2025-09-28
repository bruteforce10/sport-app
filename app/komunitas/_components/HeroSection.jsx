"use client";
import { generateSlug } from '@/lib/slugUtils';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


export default function HeroSection({community}) {

  return (
    <div className="relative h-64 bg-gradient-to-r from-primary-custom to-dark-custom overflow-hidden">
      <div className="absolute inset-0 bg-opacity-30">
        <Image src={`/cover/${generateSlug(community.category)}.webp`} width={2000} height={2000}
        alt={`${generateSlug(community.category)}-active-sport-app`} className='w-full h-[250px] object-cover'/>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <Link
          href="/komunitas"
          className="absolute top-4 left-4 p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
