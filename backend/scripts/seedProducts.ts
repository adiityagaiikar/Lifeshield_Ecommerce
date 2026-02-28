import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../src/models/Product';

dotenv.config();

const PRODUCTS = [
  {
    name: 'AquaShield Portable Purifier',
    sku: 'LS-WATER-001',
    category: 'Water Purification',
    price: 149.0,
    description: 'Compact gravity-fed filtration kit designed for emergency hydration in home and field scenarios.',
    image: '/assets/products/water.svg',
    stock: 36,
    baseShelfLifeDays: 1825,
    tags: ['water', 'filter', 'hydration'],
    demandVelocity: 12,
    features: ['0.1 micron filtration', 'No power required', 'Includes carry pouch'],
    techSpecs: { weight: '1.2 kg', dimensions: '32 x 16 x 10 cm', material: 'BPA-free polymer', warranty: '2 years' },
    rating: 4.6,
    numReviews: 2,
    reviews: [
      { name: 'Aarav', rating: 5, comment: 'Excellent quality and easy setup.' },
      { name: 'Neha', rating: 4, comment: 'Reliable for weekend preparedness.' },
    ],
  },
  {
    name: 'Guardian Trauma Medkit Pro',
    sku: 'LS-MED-002',
    category: 'Tactical Medkits',
    price: 199.0,
    description: 'Comprehensive trauma response kit with tourniquet, chest seal, gauze, and emergency tools.',
    image: '/assets/products/medkit.svg',
    stock: 24,
    baseShelfLifeDays: 1460,
    tags: ['medical', 'trauma', 'first-aid'],
    demandVelocity: 18,
    features: ['TCCC-inspired layout', 'Color-coded compartments', 'Weather-resistant shell'],
    techSpecs: { weight: '2.1 kg', dimensions: '38 x 24 x 16 cm', material: 'Nylon', warranty: '3 years' },
    rating: 4.8,
    numReviews: 2,
    reviews: [
      { name: 'Riya', rating: 5, comment: 'Perfect for family and vehicle use.' },
      { name: 'Kabir', rating: 5, comment: 'Very organized and complete.' },
    ],
  },
  {
    name: '72H Emergency Nutrition Pack',
    sku: 'LS-RATION-003',
    category: 'Long-Term Rations',
    price: 89.0,
    description: 'High-calorie, shelf-stable ration system designed for 72-hour emergency deployment.',
    image: '/assets/products/ration.svg',
    stock: 52,
    baseShelfLifeDays: 3650,
    tags: ['ration', 'food', 'shelf-stable'],
    demandVelocity: 10,
    features: ['5-year shelf life', 'Balanced macros', 'No cooking required'],
    techSpecs: { weight: '3.4 kg', dimensions: '42 x 30 x 18 cm', material: 'Foil multi-layer pouches', warranty: 'N/A' },
    rating: 4.4,
    numReviews: 1,
    reviews: [{ name: 'Sana', rating: 4, comment: 'Great shelf life and decent taste.' }],
  },
  {
    name: 'SolarCharge Grid-Down Kit',
    sku: 'LS-POWER-004',
    category: 'Power & Comms',
    price: 249.0,
    description: 'Foldable solar panel and battery station combo for emergency communications and charging.',
    image: '/assets/products/power.svg',
    stock: 19,
    baseShelfLifeDays: 2555,
    tags: ['solar', 'battery', 'communication'],
    demandVelocity: 16,
    features: ['600W surge output', 'Fast USB-C PD', 'Integrated LED lamp'],
    techSpecs: { weight: '4.6 kg', dimensions: '44 x 32 x 20 cm', material: 'ABS + aluminum', warranty: '2 years' },
    rating: 4.7,
    numReviews: 2,
    reviews: [
      { name: 'Ishaan', rating: 5, comment: 'Runs my essentials without issues.' },
      { name: 'Maya', rating: 4, comment: 'Slightly heavy but very reliable.' },
    ],
  },
  {
    name: 'ThermoShield Shelter Bundle',
    sku: 'LS-SHELTER-005',
    category: 'Shelter & Warmth',
    price: 129.0,
    description: 'All-weather shelter and thermal insulation package for rapid emergency response.',
    image: '/assets/products/shelter.svg',
    stock: 33,
    baseShelfLifeDays: 3650,
    tags: ['shelter', 'warmth', 'thermal'],
    demandVelocity: 9,
    features: ['Waterproof canopy', 'Reflective thermal layer', 'Quick setup anchors'],
    techSpecs: { weight: '2.8 kg', dimensions: '36 x 20 x 14 cm', material: 'Ripstop polyester', warranty: '18 months' },
    rating: 4.5,
    numReviews: 1,
    reviews: [{ name: 'Dev', rating: 5, comment: 'Setup is quick and insulation is impressive.' }],
  },
  {
    name: 'FieldCraft Multi-Tool Set',
    sku: 'LS-TOOLS-006',
    category: 'Tools & Hardware',
    price: 69.0,
    description: 'Versatile steel multi-tool set tailored for emergency repairs and utility operations.',
    image: '/assets/products/tools.svg',
    stock: 61,
    baseShelfLifeDays: 5475,
    tags: ['tools', 'repair', 'hardware'],
    demandVelocity: 7,
    features: ['12-in-1 tool core', 'Corrosion-resistant steel', 'Locking blade design'],
    techSpecs: { weight: '0.9 kg', dimensions: '24 x 12 x 6 cm', material: 'Stainless steel', warranty: '5 years' },
    rating: 4.3,
    numReviews: 1,
    reviews: [{ name: 'Anaya', rating: 4, comment: 'Great value and feels durable.' }],
  },
];

const normalizeReviews = (reviews: any[] = []) =>
  reviews.map((review) => ({
    user: new mongoose.Types.ObjectId(),
    name: review.name,
    rating: review.rating,
    comment: review.comment,
    createdAt: new Date(),
  }));

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lifeshield');

  await Product.deleteMany({});

  const payload = PRODUCTS.map((product) => ({
    ...product,
    stockCount: product.stock,
    reviews: normalizeReviews(product.reviews),
  }));

  await Product.insertMany(payload);

  await mongoose.disconnect();
  console.log(`Seeded ${payload.length} products.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
