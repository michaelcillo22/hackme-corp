
import express from 'express';
import usersData from '../data/users.js';

import helpers from '../RDUsershelpers.js';

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const users = await usersData.getAllUsers({}, {"_id": 1, "userId": 1});

      
      return res.json(users);
  } catch (e) {
      return res.status(500).send(e);
  }
  })
  .post(async (req, res) => {
    //code here for POST
    const usersPostData = req.body;

    if (!usersPostData || Object.keys(usersPostData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }

    try {
      usersPostData.userId = helpers.validateEmail(usersPostData.userId, 'UserId', 7);
      usersPostData.userName = helpers.validateString(usersPostData.userName, 'userName', 2);
      usersPostData.password = helpers.validatePassword(usersPostData.password, 'password', 12);
      usersPostData.userType = helpers.validateString(usersPostData.userType, 'userType');
      
      

    } catch (e) {
      return res.status(400).json({error: e.message});
    }

    try {
      
      const postedUser = await usersData.createUser(usersPostData);
      return res.status(201).json(postedUser);

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
          const user = await usersData.getUserById(req.params.id);
          return res.json(user);
      } catch (e) {
          return res.status(404).json({ error: "User Not Found!"});
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
      const result = await usersData.removeUser(req.params.id);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })

  .put(async (req, res) => {
    //code here for PUT
    const updatedUserData = req.body;

    if (!updatedUserData || Object.keys(updatedUserData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body'});
    }

    try {
      req.params.id = helpers.checkId(req.params.id);
      updatedUserData.userName = helpers.validateString(updatedUserData.userName, 'userName', 12);
      updatedUserData.password = helpers.validatePassword(updatedUserData.password, 'password', 12);
      updatedUserData.userType = helpers.validateString(updatedUserData.userType, 'userType');
    

    } catch (e) {
      console.error('Validation error:', e);
      return res.status(400).json({ error: e.message || e});
    }

    try {
      const updatedUser = await usersData.updateUser(
        req.params.id,
        updatedUserData);
        return res.json(updatedUser);

      
    } catch (e) {
      console.error('Update Error:', e);
      return res.status(404).json({ error: e.message || 'Update failed'});
    }
  });

  export default router;