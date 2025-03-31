import { ObjectId, } from 'mongodb';
import { categories } from '../config/mongoCollections.js';
import { checkId, validateString} from '../helpers.js';


const createCategory = async (

    categoryName,
    childCategory = null,
    parentCategory = null,
    description 

) => {

    if (!categoryName || !description) {
        throw new Error('You must enter valid inputs for all fields');
    }

    const categoriesCollection = await categories();

    categoryName = validateString(categoryName, 'categoryName', 3);
    description = validateString(description, 'description', 20);
    
    if (childCategory) {
        const child = await categoriesCollection.findOne({ _id: new ObjectId(childCategory.id)});
        if (!child || child.categoryName !== childCategory.name) {
            throw new Error('Invalid child category');
        }
    }
    if (parentCategory) {
        const parent = await categoriesCollection.findOne({ _id: new ObjectId(parentCategory.id)});
    
        if (!parent || parent.categoryName !== parentCategory.name) {
            throw new Error('Invalid parent category');
        }
    }


    let newCategory = {
        
        categoryName,
        childCategory: childCategory || null,
        parentCategory: parentCategory || null,
        description 

    }

    
    const insertInfo = await categoriesCollection.insertOne(newCategory);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw new Error('Could not add user');
    }
    const newId = insertInfo.insertedId.toString();
    newCategory = { _id: newId, ...newCategory };

  
    return newCategory; 

}

const getAllCategories = async () => {

    const categoriesCollection = await categories();
    let categoriesList = await categoriesCollection.find({}).toArray();
    if (!categoriesList) {
      throw 'Could not get all categories';
    }
    categoriesList = categoriesList.map((element) => {
      element._id = element._id.toString();
      return element;
    }
  );
  return categoriesList;
  };


  const getCategoryById = async (id) => {
  
    id = checkId(id);
    const categoriesCollection = await categories();
    const category = await categoriesCollection.findOne({_id: new ObjectId(id)});
    if (category === null) throw 'No category with that id';
    category._id = category._id.toString();
    return category;
};

const updateCategory = async (

  id,
  categoryName,
  childCategory = null,
  parentCategory = null
  

) => {

  if (!id || !categoryName) {
      throw new Error('You must enter valid inputs for all fields');
  }

  id = checkId(id);

  const categoriesCollection = await categories();

  // categoryName = validateString(categoryName, 'categoryName', 3);
  
  const categoryToUpdate = await categoriesCollection.findOne({ _id: new ObjectId(id)});
  if (!categoryToUpdate) {
    throw new Error('Not a valid category');
  }
  
  if (childCategory) {
      const child = await categoriesCollection.findOne({ _id: new ObjectId(childCategory.id)});
      if (!child || child.categoryName !== childCategory.name) {
          throw new Error('Invalid child category');
      }
  }
  if (parentCategory) {
      const parent = await categoriesCollection.findOne({ _id: new ObjectId(parentCategory.id)});
  
      if (!parent || parent.categoryName !== parentCategory.name) {
          throw new Error('Invalid parent category');
      }
  }


  const updatedCategory = {
      
      categoryName,
      childCategory: childCategory || null,
      parentCategory: parentCategory || null,
      description: categoryToUpdate.description
      

  }

  
  
  const updateResult = await categoriesCollection.findOneAndUpdate(
    { _id: new ObjectId(id) }, 
    { $set: updatedCategory },
  { returnDocument: 'after' }
);

if (!updateResult.value) {
  throw new Error('Failed to update category');
}

  return updateResult.value; 

};

const removeCategory = async (id) => {
    id = checkId(id);
      const categoriesCollection = await categories();
  
      console.log("Categories collection:", categoriesCollection);
  
      const deletionInfo = await categoriesCollection.findOneAndDelete({
        _id: new ObjectId(id)
      });
  
      console.log("Deletion info", deletionInfo);
  
      if (!deletionInfo) {
        throw `Could not delete category with id of ${id}`;
      }
      return `${deletionInfo.value} has been deleted.`;
    
  };

  const categoryMethods = { createCategory, getAllCategories, getCategoryById, updateCategory, removeCategory };

  export default categoryMethods;