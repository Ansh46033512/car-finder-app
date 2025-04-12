import { NextResponse } from 'next/server';
import allCars from '@/data/cars.json';
import { Car } from '@/types/cars';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const API_NINJAS_KEY = process.env.API_NINJAS_KEY;

async function fetchUnsplashImage(query: string) {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
  );
  const data = await res.json();
  return data.results?.[0]?.urls?.small || '/images/default.jpg';
}

async function fetchCarFromApiNinjas(make: string, model: string): Promise<Car[]> {
  const res = await fetch(
    `https://api.api-ninjas.com/v1/cars?make=${make}&model=${model}`,
    {
      headers: {
        'X-Api-Key': API_NINJAS_KEY!,
      },
    }
  );

  if (!res.ok) return [];

  const apiData = await res.json();

  return Promise.all(
    apiData.map(async (item: any, index: number): Promise<Car> => {
      const image = await fetchUnsplashImage(`${item.make} ${item.model}`);
      return {
        id: 10000 + index, // Ensure no ID conflict
        brand: item.make,
        name: item.model,
        fuel: item.fuel_type || 'Unknown',
        seating: 5, // default since not in API
        price: 0,   // unknown, set as 0 or estimate
        image,
        description: `${item.year} ${item.make} ${item.model}, ${item.class}`,
      };
    })
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brand = searchParams.get('brand');
  const fuel = searchParams.get('fuel');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const seating = searchParams.get('seating');
  const sort = searchParams.get('sort');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let filteredCars: Car[] = allCars;

  if (brand) {
    const searchText = brand.toLowerCase();
    filteredCars = filteredCars.filter(car =>
      `${car.brand} ${car.name}`.toLowerCase().includes(searchText)
    );
  }

  if (fuel) {
    filteredCars = filteredCars.filter(car =>
      car.fuel.toLowerCase() === fuel.toLowerCase()
    );
  }

  if (minPrice) {
    const min = parseInt(minPrice);
    if (!isNaN(min)) {
      filteredCars = filteredCars.filter(car => car.price >= min);
    }
  }

  if (maxPrice) {
    const max = parseInt(maxPrice);
    if (!isNaN(max)) {
      filteredCars = filteredCars.filter(car => car.price <= max);
    }
  }

  if (seating) {
    const seat = parseInt(seating);
    if (!isNaN(seat)) {
      filteredCars = filteredCars.filter(car => car.seating === seat);
    }
  }

  if (sort === 'price_asc') {
    filteredCars.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filteredCars.sort((a, b) => b.price - a.price);
  }

  const total = filteredCars.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  let paginatedCars = filteredCars.slice(start, start + limit);

  // Enhance with Unsplash images
  const carsWithImages = await Promise.all(
    paginatedCars.map(async (car) => {
      if (!car.image || car.image.trim() === '') {
        const unsplashImage = await fetchUnsplashImage(`${car.brand} ${car.name}`);
        return { ...car, image: unsplashImage };
      }
      return car;
    })
  );

  // 🔍 If no local cars found, try fetching from API Ninjas
  if (carsWithImages.length === 0 && brand) {
    const apiCars = await fetchCarFromApiNinjas(brand.toLowerCase(), '');
    if (apiCars.length > 0) {
      return NextResponse.json({
        data: apiCars.slice(0, limit),
        total: apiCars.length,
        page: 1,
        totalPages: Math.ceil(apiCars.length / limit),
      });
    }

    // fallback card
    const fallbackImage = await fetchUnsplashImage(brand);
    const fallbackCar: Car = {
      id: 0,
      brand,
      name: brand,
      fuel: 'Unknown',
      seating: 0,
      price: 0,
      image: fallbackImage,
      description: `No results found for "${brand}". Here's a preview from Unsplash.`,
    };

    return NextResponse.json({
      data: [fallbackCar],
      total: 1,
      page: 1,
      totalPages: 1,
    });
  }

  return NextResponse.json({
    data: carsWithImages,
    total,
    page,
    totalPages,
  });
}
