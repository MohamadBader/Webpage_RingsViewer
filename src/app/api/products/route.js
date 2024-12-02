import products from './products.json';

export async function GET(req) {
  const goldPrice = await fetchGoldPrice();

  // Enrich products with price and popularity score
  const enrichedProducts = products.map((product) => {
    const price = calculatePrice(product, goldPrice);
    return {
      ...product,
      price: parseFloat(price.toFixed(2)), // Ensure it's a number
      popularityScore: parseFloat((product.popularityScore / 20).toFixed(1)), // Convert to 5-point scale
    };
  });

  // Extract query parameters
  const url = new URL(req.url);
  const minPrice = parseFloat(url.searchParams.get('minPrice')) || 0;
  const maxPrice = parseFloat(url.searchParams.get('maxPrice')) || Infinity;
  const minPopularity = parseFloat(url.searchParams.get('minPopularity')) || 0;
  const maxPopularity = parseFloat(url.searchParams.get('maxPopularity')) || 5;

  // Filter products
  const filteredProducts = enrichedProducts.filter((product) => {
    return (
      product.price >= minPrice &&
      product.price <= maxPrice &&
      product.popularityScore >= minPopularity &&
      product.popularityScore <= maxPopularity
    );
  });

  return new Response(JSON.stringify(filteredProducts), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function fetchGoldPrice() {
  try {
    const response = await fetch('http://localhost:3000/api/goldPrice');
    if (!response.ok) throw new Error('Failed to fetch gold price');
    const data = await response.json();
    return data.goldPrice;
  } catch (error) {
    console.error('Error fetching gold price:', error);
    return 60; // Default gold price (fallback)
  }
}

function calculatePrice(product, goldPrice) {
  return ((product.popularityScore / 20) + 1) * product.weight * (goldPrice / 31.1035);
}
