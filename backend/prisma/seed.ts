import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const vehicles = [
  { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 285000, quantity: 7 },
  { make: 'Toyota', model: 'Fortuner', category: 'SUV', price: 520000, quantity: 3 },
  { make: 'Honda', model: 'Civic', category: 'Sedan', price: 275000, quantity: 5 },
  { make: 'Hyundai', model: 'Creta', category: 'SUV', price: 210000, quantity: 8 },
  { make: 'Kia', model: 'Seltos', category: 'SUV', price: 225000, quantity: 4 },
  { make: 'BMW', model: 'X5', category: 'SUV', price: 780000, quantity: 2 },
  { make: 'Audi', model: 'A4', category: 'Sedan', price: 490000, quantity: 3 },
  { make: 'Mercedes', model: 'C-Class', category: 'Sedan', price: 540000, quantity: 1 },
  { make: 'Tata', model: 'Nexon', category: 'Compact SUV', price: 165000, quantity: 0 },
  { make: 'Mahindra', model: 'Scorpio', category: 'SUV', price: 240000, quantity: 6 },
];

const seed = async () => {
  // Clear existing data
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Seed vehicles
  await prisma.vehicle.createMany({
    data: vehicles,
  });

  console.log('✅ Database seeded successfully');
  console.log('👤 Admin Credentials:');
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123');
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });