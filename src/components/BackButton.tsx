'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = 'Voltar' }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
    >
      <FaArrowLeft className="text-sm" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
} 