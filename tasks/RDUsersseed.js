import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import userMethods from '../data/users.js';


export async function seedDB() {
  const db = await dbConnection();

    try {
        // await db.collection('users').drop();
    console.log('Dropped existing users collection.');
  } catch (e) {
    console.log('Users collection does not exist yet. No need to drop.');
    }

    try {
        console.log('Seeding users...');
    
        // Seed users with valid inputs
        const user1 = await userMethods.createUser(
          'user1@example.com',
          'John Doe',
          'Passworgggggd123!',
          'buyer'
        );
    
        const user2 = await userMethods.createUser(
          'user2@example.com',
          'Jane Smith',
          'SecurePass456!',
          'buyer'
        );
    
        const user3 = await userMethods.createUser(
          'user3@example.com',
          'Emily Johnson',
          'MyPassword789!',
          'seller'
        );
    
        const user4 = await userMethods.createUser(
          'user4@example.com',
          'Michael Brown',
          'BrownieSecure009!',
          'seller'
        );
    
        const user5 = await userMethods.createUser(
          'user5@example.com',
          'Chris Green',
          'GreenMonster667!',
          'seller'
        );
    
        const user6 = await userMethods.createUser(
          'user6@example.com',
          'Sophia White',
          'WhiteRabbit2025!',
          'seller'
        );
    
        const user7 = await userMethods.createUser(
          'user7@example.com',
          'David Black',
          'BlackMaggggic998!',
          'seller'
        );
    
        const user8 = await userMethods.createUser(
          'user8@example.com',
          'Olivia Blue',
          'BlueSkggggggy445!',
          'buyer'
        );
    
        console.log('Users successfully added!');
        console.log('Seeding complete!');
      } catch (e) {
        console.error('Error seeding the database:', e);
      } 
      }
    
    
    seedDB().catch((e) => {
      console.error('Error running seed script:', e);
    });
    
