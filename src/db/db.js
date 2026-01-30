import Dexie from 'dexie';

export const db = new Dexie('BoltPOSDB');

db.version(1).stores({
  products: '++id, name, price, category',
  sales: '++id, date, total, items, paymentMethod'
});

export default db;
