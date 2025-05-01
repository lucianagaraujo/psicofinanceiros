'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const clienteId = '1'; // Temporariamente hardcoded, depois podemos pegar dinamicamente
  
  const modules = [
    {
      title: 'Meu Retrato Financeiro',
      subItems: [
        { name: 'Eu Atual', path: `/cliente/${clienteId}/eu-atual` },
        { name: 'Eu Ideal', path: `/cliente/${clienteId}/eu-ideal` },
        { name: 'Meus Compromissos', path: `/cliente/${clienteId}/compromissos` }
      ]
    },
    {
      title: 'Sonhos',
      path: `/cliente/${clienteId}/sonhos`,
    }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {modules.map((module) => (
              <div key={module.title} className="relative group inline-block">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  {module.title}
                </button>
                
                {module.subItems && (
                  <div className="absolute z-10 hidden group-hover:block w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {module.subItems.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`block px-4 py-2 text-sm ${
                            pathname === item.path
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {!module.subItems && (
                  <Link
                    href={module.path}
                    className={`block px-4 py-2 text-sm ${
                      pathname === module.path
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {module.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 