const bcrypt = require('bcryptjs');
const { sequelize, User, Product } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await sequelize.authenticate();
    
    // Sync models
    console.log('Force syncing models...');
    await sequelize.sync({ force: true });
    console.log('Database tables cleared and recreated.');

    // Create Users
    console.log('Creating users...');
    const adminPasswordHash = await bcrypt.hash('adminpassword', 10);
    const userPasswordHash = await bcrypt.hash('userpassword', 10);

    const admin = await User.create({
      username: 'admin',
      password: adminPasswordHash,
      role: 'admin',
    });

    const user = await User.create({
      username: 'user',
      password: userPasswordHash,
      role: 'user',
    });

    console.log(`Users created:\n- Admin: username "admin", password "adminpassword"\n- User: username "user", password "userpassword"`);

    // Create Products
    console.log('Creating default products...');
    const products = [
      {
        name: 'Cyberpunk Mechanical Keyboard',
        description: 'Vibrant RGB mechanical keyboard with hot-swappable tactile switches, glassmorphic layout, and premium aluminum shell.',
        price: 15999.00,
        stock: 25,
        image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Quantum Wireless Headset',
        description: 'Ultra-low latency premium gaming headset with dynamic 3D spatial audio, memory foam ear cups, and 40-hour battery life.',
        price: 19999.00,
        stock: 12,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Aero Ergonomic Chair',
        description: 'State-of-the-art office chair with high-breathability mesh, complete lumbar support, adjustable 4D armrests, and dynamic reclining.',
        price: 39999.00,
        stock: 8,
        image_url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Glassmorphic Smart Watch',
        description: 'A beautiful titanium smart wearable with AMOLED always-on display, cellular link, 7-day heart tracker, and fitness companion.',
        price: 29999.00,
        stock: 30,
        image_url: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Minimalist Leather Desk Pad',
        description: 'Full grain splash-resistant premium leather desk mat, perfect for mouse tracking and protecting office work surfaces.',
        price: 3499.00,
        stock: 50,
        image_url: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Neo Sphere Table Lamp',
        description: 'Beautiful diffuse lighting lamp with intelligent smartphone control, customizable RGB color space, and touch toggle.',
        price: 5999.00,
        stock: 15,
        image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80'
      }
    ];

    await Product.bulkCreate(products);
    console.log('Seeded products database successfully!');
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed:', error);
    process.exit(1);
  }
};

seedDatabase();
