/**
 * Mock product data for the demo
 */

export interface Product {
  asin: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  category?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    asin: 'B0COMP01',
    title: 'HydroFlask 32oz Wide Mouth Water Bottle',
    price: 44.99,
    rating: 4.5,
    reviews: 8932,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP02',
    title: 'Yeti Rambler 26oz Insulated Bottle',
    price: 34.99,
    rating: 4.4,
    reviews: 5621,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP03',
    title: 'Generic Water Bottle',
    price: 8.99,
    rating: 3.2,
    reviews: 45,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP04',
    title: 'Bottle Cleaning Brush Set',
    price: 12.99,
    rating: 4.6,
    reviews: 3421,
    category: 'Sports & Outdoors > Accessories',
  },
  {
    asin: 'B0COMP05',
    title: 'Replacement Lid for HydroFlask',
    price: 15.99,
    rating: 4.3,
    reviews: 1234,
    category: 'Sports & Outdoors > Accessories',
  },
  {
    asin: 'B0COMP06',
    title: 'Water Bottle Carrier Bag with Strap',
    price: 19.99,
    rating: 4.1,
    reviews: 567,
    category: 'Sports & Outdoors > Accessories',
  },
  {
    asin: 'B0COMP07',
    title: 'Stanley Adventure Quencher 40oz',
    price: 35.00,
    rating: 4.3,
    reviews: 4102,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP08',
    title: 'CamelBak Chute Mag 32oz',
    price: 29.99,
    rating: 4.2,
    reviews: 2891,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP09',
    title: 'Nalgene Wide Mouth 32oz',
    price: 12.99,
    rating: 4.0,
    reviews: 15234,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP10',
    title: 'Klean Kanteen Classic 27oz',
    price: 27.99,
    rating: 4.4,
    reviews: 6789,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP11',
    title: 'Premium Titanium Water Bottle 32oz',
    price: 89.00,
    rating: 4.8,
    reviews: 234,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP12',
    title: 'Simple Modern Classic 32oz',
    price: 24.99,
    rating: 4.3,
    reviews: 4567,
    category: 'Sports & Outdoors > Water Bottles',
  },
];

export const REFERENCE_PRODUCT: Product = {
  asin: 'B0XYZ123',
  title: 'ProBrand Steel Bottle 32oz Insulated',
  price: 29.99,
  rating: 4.2,
  reviews: 1247,
  category: 'Sports & Outdoors > Water Bottles',
};

