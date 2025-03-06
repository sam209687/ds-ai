import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create normal user 

  const userPassword = await hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })
  

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 't-shirts' },
      update: {},
      create: {
        name: 'T-Shirts',
        slug: 't-shirts',
        image: '/images/p1.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'jeans' },
      update: {},
      create: {
        name: 'Jeans',
        slug: 'jeans',
        image: '/images/p3.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'shoes' },
      update: {},
      create: {
        name: 'Shoes',
        slug: 'shoes',
        image: '/images/p5.jpg',
      },
    }),
  ])

  // Create products for each category
  // T-Shirts
  await prisma.product.upsert({
    where: { sku: 'TSH-001' },
    update: {},
    create: {
      name: 'Classic Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt perfect for everyday wear',
      price: 29.99,
      images: ['/images/p1.jpg', '/images/p2.jpg'],
      stock: 100,
      sku: 'TSH-001',
      categoryId: categories[0].id,
    },
  })

  await prisma.product.upsert({
    where: { sku: 'TSH-002' },
    update: {},
    create: {
      name: 'Graphic Print T-Shirt',
      description: 'Stylish graphic print t-shirt with modern design',
      price: 34.99,
      images: ['/images/p2.jpg', '/images/p1.jpg'],
      stock: 75,
      sku: 'TSH-002',
      categoryId: categories[0].id,
    },
  })

  // Jeans
  await prisma.product.upsert({
    where: { sku: 'JNS-001' },
    update: {},
    create: {
      name: 'Slim Fit Jeans',
      description: 'Classic slim fit jeans with perfect stretch',
      price: 79.99,
      images: ['/images/p3.jpg', '/images/p4.jpg'],
      stock: 50,
      sku: 'JNS-001',
      categoryId: categories[1].id,
    },
  })

  await prisma.product.upsert({
    where: { sku: 'JNS-002' },
    update: {},
    create: {
      name: 'Relaxed Fit Jeans',
      description: 'Comfortable relaxed fit jeans for casual wear',
      price: 69.99,
      images: ['/images/p4.jpg', '/images/p3.jpg'],
      stock: 60,
      sku: 'JNS-002',
      categoryId: categories[1].id,
    },
  })

  // Shoes
  await prisma.product.upsert({
    where: { sku: 'SHO-001' },
    update: {},
    create: {
      name: 'Running Sneakers',
      description: 'Lightweight running shoes with superior comfort',
      price: 129.99,
      images: ['/images/p5.jpg', '/images/p6.jpg'],
      stock: 40,
      sku: 'SHO-001',
      categoryId: categories[2].id,
    },
  })

  await prisma.product.upsert({
    where: { sku: 'SHO-002' },
    update: {},
    create: {
      name: 'Casual Sneakers',
      description: 'Versatile casual sneakers for everyday style',
      price: 89.99,
      images: ['/images/p6.jpg', '/images/p5.jpg'],
      stock: 45,
      sku: 'SHO-002',
      categoryId: categories[2].id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 