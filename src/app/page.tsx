

'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './styles.module.css';
import { Navigation, Scrollbar } from 'swiper/modules';

type Product = {
  name: string;
  popularityScore: string;
  weight: number;
  price: string;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };
};

const fetchFilteredProducts = async (filters: Record<string, string>): Promise<Product[]> => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/products?${queryParams}`);
  return response.json();
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', minPopularity: '', maxPopularity: '' });

  const applyFilters = () => {
    fetchFilteredProducts(filters).then(setProducts);
  };

  useEffect(() => {
    applyFilters(); // Fetch products with current filters on load
  }, []);

  return (
    <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
            <Link href="/">
          <img
            src="https://www.kutez.com/_next/image?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fkutezadmin.appspot.com%2Fo%2Fkutez-webite%252FHeader-Navbar%252Flogo.png%3Falt%3Dmedia%26token%3D64aa5d45-79e9-43ed-b459-34febd0159f5&w=256&q=75"
            alt="Company Logo"
            className={styles.logo}
          />
        </Link>
      </header>
      <h1 className={styles.title}>Product List</h1>
      
      {/* Filters Section */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Min Price</label>
          <input
            type="number"
            placeholder="Enter min price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            min={0}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Max Price</label>
          <input
            type="number"
            placeholder="Enter max price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            min={0}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Min Popularity</label>
          <input
            type="number"
            placeholder="Enter min popularity (0-5)"
            value={filters.minPopularity}
            onChange={(e) => {
              const value = Math.min(5, Math.max(0, parseFloat(e.target.value) || 0)); // Restrict range
              setFilters({ ...filters, minPopularity: value.toString() });
            }}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Max Popularity</label>
          <input
            type="number"
            placeholder="Enter max popularity (0-5)"
            value={filters.maxPopularity}
            onChange={(e) => {
              const value = Math.min(5, Math.max(0, parseFloat(e.target.value) || 0)); // Restrict range
              setFilters({ ...filters, maxPopularity: value.toString() });
            }}
          />
        </div>
        <button className={styles.applyButton} onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      {/* Swiper Carousel */}
      <Swiper
          modules={[Navigation, Scrollbar]}
          navigation
          scrollbar={{ draggable: true }}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            1024: { slidesPerView: 4 },
            768: { slidesPerView: 2 },
            480: { slidesPerView: 1 },
          }}
          className={styles.carousel}
        >
      {products.map((product, index) => (
        <SwiperSlide key={index}>
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
}


type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  const [color, setColor] = useState<keyof Product['images']>('yellow');

  const colorNames: Record<string, string> = {
    yellow: 'Yellow Gold',
    white: 'White Gold',
    rose: 'Rose Gold',
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className={styles.stars}>
        {Array(fullStars)
          .fill(null)
          .map((_, i) => (
            <span key={`full-${i}`} className={styles.fullStar}>★</span>
          ))}
        {halfStar && <span className={styles.halfStar}>★</span>}
        {Array(emptyStars)
          .fill(null)
          .map((_, i) => (
            <span key={`empty-${i}`} className={styles.emptyStar}>☆</span>
          ))}
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <img src={product.images[color]} alt={product.name} className={styles.image} />
      <h2 className={styles.name}>{product.name}</h2>
      <p className={styles.price}>${product.price} USD</p>
      <div className={styles.colors}>
        {Object.keys(product.images).map((clr) => (
          <button
            key={clr}
            style={{
              backgroundColor: clr === 'yellow' ? '#E6CA97' : clr === 'rose' ? '#E1A4A9' : '#D9D9D9',
              border: color === clr ? '2px solid black' : '1px solid #ddd',
            }}
            className={`${styles.colorButton}`}
            onClick={() => setColor(clr as keyof Product['images'])}
          ></button>
        ))}
      </div>
      <p className={styles.currentColor}>{colorNames[color]}</p>
      <p className={styles.popularity}>
        {product.popularityScore}/5
        {renderStars(parseFloat(product.popularityScore))}
      </p>
    </div>
  );
}
