'use client';

import { useEffect, useState } from 'react';
import { Car } from '@/types/cars';
import CarCard from '@/components/CarCard';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Car[]>([]);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    const data = stored ? JSON.parse(stored) : [];
    setWishlist(data);
  }, []);

  const handleRemove = (carId: number) => {
    setRemovingId(carId);
    setTimeout(() => {
      const updated = wishlist.filter(car => car.id !== carId);
      setWishlist(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setRemovingId(null);
    }, 300); // Delay for animation
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center text-muted">
          <h4>😢 No cars in wishlist</h4>
          <p>Go explore and add some cars!</p>
        </div>
      ) : (
        <div className="row">
          {wishlist.map(car => (
            <div
              key={car.id}
              className={`col-sm-6 col-lg-4 mb-4 wishlist-item-wrapper ${
                removingId === car.id ? 'fade-out' : 'fade-in'
              }`}
            >
              <CarCard car={car} onRemove={() => handleRemove(car.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
