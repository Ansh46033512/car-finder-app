'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode');
    setDarkMode(storedTheme === 'true');

    const updateCount = () => {
      const stored = localStorage.getItem('wishlist');
      const wishlist = stored ? JSON.parse(stored) : [];
      setWishlistCount(wishlist.length);
    };

    updateCount();
    window.addEventListener('wishlistUpdated', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('wishlistUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    document.body.classList.toggle('bg-dark', darkMode);
    document.body.classList.toggle('text-light', darkMode);
  }, [darkMode]);

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} px-4`}>
      <Link className="navbar-brand" href="/">🚗 Car Finder</Link>
      <div className="ms-auto d-flex gap-3 align-items-center">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setDarkMode(prev => !prev)}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        <Link className="btn btn-outline-primary position-relative" href="/wishlist">
          🤍 Wishlist
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {wishlistCount}
          </span>
        </Link>
      </div>
    </nav>
  );
}
