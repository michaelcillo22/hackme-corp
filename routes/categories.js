import express from 'express';
import categoriesData from '../data/categories.js';

import helpers from '../helpers/RDUsershelpers.js';

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const categories = await categoriesData.getAllCategories({}, {"_id": 1, "categoryName": 1});

      
      return res.json(categories);
  } catch (e) {
      return res.status(500).send(e);
  }
  })
  .post(async (req, res) => {
    //code here for POST
    const categoriesPostData = req.body;

    if (!categoriesPostData || Object.keys(categoriesPostData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }

    try {
        categoriesPostData.categoryName = helpers.validateString(categoriesPostData.categoryName, 'categoryName', 3);
        categoriesPostData.description = helpers.validateString(categoriesPostData.description, 'description', 20);
      
      
      

    } catch (e) {
      return res.status(400).json({error: e.message});
    }

    try {
      
      const postedCategory = await categoriesData.createCategory(categoriesPostData);
      return res.status(201).json(postedCategory);

    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

  router
  .route('/:id')
  
    .get(async (req, res) => {

      
      try {
          req.params.id = helpers.checkId(req.params.id);
      } catch (e) {
          return res.status(400).json({ error: e})
      }
      try {
          const category = await categoriesData.getCategoryById(req.params.id);
          return res.json(category);
      } catch (e) {
          return res.status(404).json({ error: "Category Not Found!"});
      }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      req.params.id = helpers.checkId(req.params.id);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const result = await categoriesData.removeCategory(req.params.id);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })

  .put(async (req, res) => {
    //code here for PUT
    const updatedCategoriesData = req.body;

    if (!updatedCategoriesData || Object.keys(updatedCategoriesData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body'});
    }

    try {
      req.params.id = helpers.checkId(req.params.id);
      updatedCategoriesData.categoryName = helpers.validateString(updatedCategoriesData.categoryName, 'userName', 12);
      
    

    } catch (e) {
      console.error('Validation error:', e);
      return res.status(400).json({ error: e.message || e});
    }

    try {
      const updatedCategory = await categoriesData.updateCategory(
        req.params.id,
        updatedCategoriesData);
        return res.json(updatedCategory);

      
    } catch (e) {
      console.error('Update Error:', e);
      return res.status(404).json({ error: e.message || 'Update failed'});
    }
  });

  export default router;