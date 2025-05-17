import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // default false for mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const menuItems = [
    { path: '/caesar', name: 'Sezar Şifri' },
    { path: '/affine', name: 'Affin Şifri' },
    { path: '/hill', name: 'Hill Şifri' },
    { path: '/vigenere', name: 'Vijener Şifri' },
    { path: '/playfair', name: 'Playfair Şifri' },
    { path: '/coincidence-index', name: 'Üst-üstə düşmə indeksi' },
    { path: '/frequency-analysis', name: 'Tezlik Analizi' },
    { path: '/kasiski-test', name: 'Kasiski Testi' },
    { path: '/hash-functions', name: 'Heş Funksiyaları' },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // if desktop, keep sidebar open
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-50 h-full w-64 bg-gray-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-4 font-bold text-xl border-b border-gray-700 flex justify-between items-center">
 <span>Kriptoqrafiya
   <p className='font-normal text-sm italic mt-1'>Novruzov Ruhid tərəfindən hazırlanıb.</p>
   </span>       
        </div>
        <nav className="mt-4 pb-16 md:pb-0">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-1">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 hover:bg-gray-700 transition-colors ${
                      isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                    }`
                  }
                  onClick={handleLinkClick}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
