  import { useState, useEffect } from 'react';
  import Link from 'next/link';
  import { Car } from '@/types/cars';

  interface CarCardProps {
    car: Car;
    onRemove?: () => void; // New optional prop
  }

  export default function CarCard({ car, onRemove }: CarCardProps) {
    const isFallback = car.id === 0;
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
      const stored = localStorage.getItem('wishlist');
      const wishlist: Car[] = stored ? JSON.parse(stored) : [];
      setIsWishlisted(wishlist.some(c => c.id === car.id));
    }, [car.id]);

    const showToast = (message: string, type: 'success' | 'danger') => {
      const toastWrapper = document.getElementById('toastWrapper');
      if (!toastWrapper) return;
    
      const toast = document.createElement('div');
      toast.className = `toast align-items-center text-bg-${type} border-0 show mb-2 slide-in`;
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'assertive');
      toast.setAttribute('aria-atomic', 'true');
    
      toast.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;
    
      toastWrapper.appendChild(toast);
    
      setTimeout(() => {
        toast.remove();
      }, 3000);
    };
    

    const toggleWishlist = () => {
      const stored = localStorage.getItem('wishlist');
      let wishlist: Car[] = stored ? JSON.parse(stored) : [];

      if (isWishlisted) {
        wishlist = wishlist.filter(c => c.id !== car.id);
        showToast(`${car.name} removed from wishlist`, 'danger');
      } else {
        wishlist.push(car);
        showToast(`${car.name} added to wishlist`, 'success');
      }
      

      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(!isWishlisted);

      // ✅ Trigger update for Navbar
      window.dispatchEvent(new Event('wishlistUpdated'));
    };

    return (
      <div className="card mb-4 shadow" style={{ width: '100%', maxWidth: '18rem' }}>
        <img
          src={car.image}
          className="card-img-top"
          alt={car.name}
          style={{ height: 180, objectFit: 'cover' }}
        />
        <div className="card-body">
          <h5 className="card-title">{car.name}</h5>
          {isFallback ? (
            <p className="card-text text-muted">{car.description}</p>
          ) : (
            <>
              <p className="card-text">
                {car.brand} • {car.fuel} • {car.seating} Seats
              </p>
              <p className="text-success">${car.price}</p>
              <Link href={`/cars/${car.id}`} className="btn btn-primary mb-2">
                View Details
              </Link>
              {onRemove ? ( 
                <button onClick={onRemove} className="btn btn-danger w-100 mt-2">
                  🗑 Remove from Wishlist
                </button>
              ) : (
                <button onClick={toggleWishlist} className="btn btn-outline-danger w-100">
                  {isWishlisted ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
                </button>
              )}

            </>
          )}
        </div>
      </div>
    );
  }
