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
  // High-quality successful candidates
  {
    asin: 'B0COMP13',
    title: 'Contigo AUTOSPOUT Ashland 32oz Water Bottle',
    price: 19.99,
    rating: 4.6,
    reviews: 12589,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP14',
    title: 'Iron Flask Sports Water Bottle 32oz',
    price: 26.95,
    rating: 4.7,
    reviews: 8943,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP15',
    title: 'Takeya Actives Insulated Water Bottle 32oz',
    price: 22.99,
    rating: 4.5,
    reviews: 11234,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP16',
    title: 'Under Armour Water Bottle 32oz',
    price: 24.99,
    rating: 4.4,
    reviews: 7821,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP17',
    title: 'RTIC 32oz Vacuum Insulated Bottle',
    price: 29.95,
    rating: 4.6,
    reviews: 5432,
    category: 'Sports & Outdoors > Water Bottles',
  },
  // Premium successful options
  {
    asin: 'B0COMP18',
    title: 'Swell Stainless Steel Water Bottle 32oz',
    price: 35.00,
    rating: 4.5,
    reviews: 9876,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP19',
    title: 'Zojirushi SM-SHE48 Stainless Steel Mug 16oz',
    price: 28.50,
    rating: 4.8,
    reviews: 4567,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP20',
    title: 'Owala FreeSip Insulated Water Bottle 32oz',
    price: 32.99,
    rating: 4.7,
    reviews: 6789,
    category: 'Sports & Outdoors > Water Bottles',
  },
  // Mid-range successful candidates
  {
    asin: 'B0COMP21',
    title: 'Brita Premium Filtering Water Bottle 32oz',
    price: 24.99,
    rating: 4.3,
    reviews: 3456,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP22',
    title: 'Purist Mover Water Bottle 32oz',
    price: 27.99,
    rating: 4.4,
    reviews: 5123,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP23',
    title: 'Corkcicle Canteen 25oz Insulated Bottle',
    price: 32.00,
    rating: 4.5,
    reviews: 4321,
    category: 'Sports & Outdoors > Water Bottles',
  },
  // Budget-friendly successful options
  {
    asin: 'B0COMP24',
    title: 'Bubi Bottle Insulated Water Bottle 32oz',
    price: 18.99,
    rating: 4.2,
    reviews: 2345,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP25',
    title: 'ThermoFlask Double Wall Insulated 32oz',
    price: 19.99,
    rating: 4.3,
    reviews: 7890,
    category: 'Sports & Outdoors > Water Bottles',
  },
  // Borderline/edge cases that might pass or fail
  {
    asin: 'B0COMP26',
    title: 'Coleman FreeFlow Insulated Bottle 32oz',
    price: 22.99,
    rating: 4.1,
    reviews: 1234,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP27',
    title: 'TAL Stainless Steel Water Bottle 32oz',
    price: 16.99,
    rating: 4.0,
    reviews: 567,
    category: 'Sports & Outdoors > Water Bottles',
  },
  // Lower quality that should fail filters
  {
    asin: 'B0COMP28',
    title: 'Plastic Water Bottle 32oz',
    price: 9.99,
    rating: 3.5,
    reviews: 234,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP29',
    title: 'Basic Sports Bottle',
    price: 7.99,
    rating: 3.2,
    reviews: 89,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP30',
    title: 'Discount Water Container 32oz',
    price: 5.99,
    rating: 2.8,
    reviews: 45,
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

