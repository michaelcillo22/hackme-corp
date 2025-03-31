import { dbConnection, closeConnection } from './config/mongoConnection.js';
import categoryMethods from './data/categories.js';


export async function seedDB() {

    const db = await dbConnection();
    
    try {

        console.log('Seeding categories...');

        const category1 = await categoryMethods.createCategory(
          'Technology',
          null, // No child
          null, // No parent
          'All things tech-related.'
        );

        const category2 = await categoryMethods.createCategory(
          'Programming',
          null,
          { id: category1._id, name: 'Technology' },
          'Learning to code and programming languages.'
        );
    
        const category3 = await categoryMethods.createCategory(
          'Web Development',
          null,
          { id: category2._id, name: 'Programming' },
          'Frontend and backend web development topics.'
        );
    
        const category4 = await categoryMethods.createCategory(
          'Hardware',
          null,
          { id: category1._id, name: 'Technology' },
          'Physical tech like computers, chips, and gadgets.'
        );
    
        const category5 = await categoryMethods.createCategory(
          'Gaming',
          null,
          { id: category1._id, name: 'Technology' },
          'Video games and gaming platforms.'
        );
    
        const category6 = await categoryMethods.createCategory(
          'Mobile Development',
          null,
          { id: category2._id, name: 'Programming' },
          'Creating apps for mobile devices.'
        );
    
        const category7 = await categoryMethods.createCategory(
          'AI & Machine Learning',
          null,
          { id: category2._id, name: 'Programming' },
          'Artificial intelligence and machine learning concepts.'
        );
    
        const category8 = await categoryMethods.createCategory(
          'Design',
          null,
          null,
          'UX/UI, graphic design, and digital design topics.'
        );
    
    
    



        console.log('Categories successfully added!');
        console.log('Seeding complete!');


    } catch (e) {
        console.error('Error seeding the database:', e);
      } finally {
        await closeConnection();
      }
      }
    
    
    seedDB().catch((e) => {
      console.error('Error running seed script:', e);
    });
