import db from './db';

export const seedDatabase = async () => {
  try {
    // Verificar si ya hay productos
    const count = await db.products.count();
    
    if (count === 0) {
      console.log('🌱 Sembrando base de datos con productos de ejemplo...');
      
      const sampleProducts = [
        {
          name: 'Roof Inspection',
          price: 250,
          category: 'Services'
        },
        {
          name: 'Shingle Repair',
          price: 450,
          category: 'Repairs'
        },
        {
          name: 'Full Roof Replacement',
          price: 8500,
          category: 'Installation'
        },
        {
          name: 'Gutter Cleaning',
          price: 180,
          category: 'Maintenance'
        },
        {
          name: 'Emergency Leak Repair',
          price: 350,
          category: 'Emergency'
        }
      ];
      
      await db.products.bulkAdd(sampleProducts);
      console.log('✅ Base de datos poblada con éxito!');
    } else {
      console.log('ℹ️ La base de datos ya contiene productos.');
    }
  } catch (error) {
    console.error('❌ Error al sembrar la base de datos:', error);
  }
};
