import { notFound } from 'next/navigation';
import Image from 'next/image';
import cars from '@/data/cars.json';

interface Params {
  params: {
    id: string;
  };
}

export default function CarDetailsPage({ params }: Params) {
  const car = cars.find((c) => c.id.toString() === params.id);

  if (!car) {
    return notFound(); // Show 404 if ID doesn't match
  }

  return (
    <div className="container mt-5">
      <h1>{car.name}</h1>
      <Image
        src={car.image}
        alt={car.name}
        width={800}
        height={500}
        className="img-fluid my-3 rounded"
        style={{ objectFit: 'cover' }}
      />
      <p><strong>Brand:</strong> {car.brand}</p>
      <p><strong>Fuel Type:</strong> {car.fuel}</p>
      <p><strong>Seating Capacity:</strong> {car.seating}</p>
      <p><strong>Price:</strong> ${car.price}</p>
      <p>{car.description}</p>
    </div>
  );
}
