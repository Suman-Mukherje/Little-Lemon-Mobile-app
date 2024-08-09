import * as SQLite from 'expo-sqlite';

// Open the database asynchronously
async function openDatabase() {
    return await SQLite.openDatabaseAsync('little_lemon.db');
  }

export const createTable = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('little_lemon.db',{
      useNewConnection: true
    });
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS menu (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          description TEXT,
          image TEXT,
          category TEXT
        );
      `);
  } catch (error) {
    console.error("Failed to create table", error);
  }
};

export const getMenuItems = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('little_lemon.db',{
        useNewConnection: true
      });
      const rows = await db.getAllAsync('SELECT id, name, price, description, image, category FROM menu'); // Include 'id' in the SELECT statement
      return rows;
    } catch (error) {
      console.error("Failed to get menu items", error);
      return [];
    }
  };
  

  export async function saveMenuItems(items) {
    const db = await SQLite.openDatabaseAsync('little_lemon.db',{
      useNewConnection: true
    }); // Ensure the database is open asynchronously
  
    // Create a string for bulk insert
    const values = items
      .map(item => `(
        '${item.name.replace(/'/g, "''")}', 
        ${item.price}, 
        '${item.description.replace(/'/g, "''")}', 
        '${item.image.replace(/'/g, "''")}', 
        '${item.category.replace(/'/g, "''")}'
      )`)
      .join(", ");
  
    const query = `INSERT INTO menu (name, price, description, image, category) VALUES ${values};`;
  
    try {
      await db.execAsync(query);
      console.log('Menu items saved successfully.');
    } catch (error) {
      console.error("Failed to save menu items", error);
    }
  }
  

  export const checkForDuplicates = async () => {
    try {
      const db = await openDatabase();
      const result = await db.getAllAsync('SELECT name, COUNT(*) as count FROM menu GROUP BY name HAVING count > 1');
      if (result.length > 0) {
        console.log('Duplicates found:', result);
      } else {
        console.log('No duplicates found.');
      }
    } catch (error) {
      console.error("Failed to check for duplicates", error);
    }
  };
  
  export const clearMenuTable = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('little_lemon.db',{
        useNewConnection: true
      });
      await db.execAsync('DELETE FROM menu');
      console.log('Menu table cleared.');
    } catch (error) {
      console.error("Failed to clear menu table", error);
    }
  };

  
export const getMenuItemsByCategory = async (categories) => {
  const db = await SQLite.openDatabaseAsync('little_lemon.db', {
    useNewConnection: true
  });

  let sql = 'SELECT id, name, price, description, image, category FROM menu';
  let params = [];

  if (categories && categories.length > 0 && !categories.includes('All')) {
    sql += ' WHERE category IN (?' + ', ?'.repeat(categories.length - 1) + ')';
    params = categories;
  }

  sql += ' ORDER BY price ASC';  // Sort by price in ascending order

  try {
    const rows = await db.getAllAsync(sql, params);
    return rows;
  } catch (error) {
    console.error("Failed to get menu items by category", error);
    return [];
  }
};






  
  
  