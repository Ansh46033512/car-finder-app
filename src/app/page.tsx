"use client";
import { useEffect, useState } from "react";
import CarCard from "@/components/CarCard";
import { Car } from "@/types/cars";

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brand, setBrand] = useState("");
  const [fuel, setFuel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [seating, setSeating] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(true); // controls visibility

  const carsPerPage = 10;

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        const params = new URLSearchParams();

        if (brand) params.append("brand", brand);
        if (fuel) params.append("fuel", fuel);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (seating) params.append("seating", seating);
        if (sort) params.append("sort", sort);

        params.append("page", page.toString());
        params.append("limit", carsPerPage.toString());

        const res = await fetch(`/api/cars?${params.toString()}`);

        if (!res.ok) {
          throw new Error("Failed to fetch cars. Please try again.");
        }

        const { data, totalPages } = await res.json();
        setCars(data);
        setTotalPages(totalPages);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Something went wrong.");
        } else {
          setError("An unknown error occurred.");
        }
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [brand, fuel, minPrice, maxPrice, seating, sort, page]);

  const handleReset = () => {
    setBrand("");
    setFuel("");
    setMinPrice("");
    setMaxPrice("");
    setSeating("");
    setSort("");
    setPage(1);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">🚗 Car Finder</h1>

      {/* Filters */}
      {/* Toggle Button for Filters */}
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          🔍 Filters
        </button>
      </div>

      {/* Collapsible Filters with React State */}
      <div
        className={`overflow-hidden transition-all ${
          showFilters ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          transition: "all 0.4s ease",
        }}
      >
        <div className="row g-3 mb-4 pt-2">
          <div className="col-sm-6 col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div className="col-sm-6 col-md-2">
            <select
              className="form-select"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
            >
              <option value="">Fuel</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          <div className="col-sm-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="col-sm-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="col-sm-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Seating"
              value={seating}
              onChange={(e) => setSeating(e.target.value)}
            />
          </div>
          <div className="col-sm-6 col-md-1">
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort</option>
              <option value="price_asc">↑ Price</option>
              <option value="price_desc">↓ Price</option>
            </select>
          </div>
          <div className="col-md-1">
            <button className="btn btn-secondary w-100" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Error Fallback */}
      {error && (
        <div className="alert alert-danger text-center my-4" role="alert">
          <strong>Oops!</strong> {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : cars.length === 0 && !error ? (
        <div className="text-center text-muted my-5">
          <h4>😢 No cars found.</h4>
          <p>Try adjusting the filters.</p>
        </div>
      ) : (
        <div className="row">
          {cars.map((car) => (
            <div className="col-sm-6 col-lg-4 mb-4 fade-in" key={car.id}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !error && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {Array.from({ length: totalPages }).map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Toast Container for Wishlist Notifications */}
      <div
        className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
        id="toastWrapper"
        style={{ zIndex: 1055 }}
      ></div>
    </div>
  );
}
